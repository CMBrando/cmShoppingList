export default {
    template: '#shoppinglist-component',
    data: function () {
        return {
            assetText: '',
            assetArr: [],
            fitText: '',
            fitArr: [],
            marketTypes: [],
            coveredList: [],
            fitMultiplier: 1,
            resultText: '',
            resultTypes: [],
            estimatedPrice: 0,
            equivalentItems: []
        };
    },
    props: ['string'],
    created: function () {
        this.loadTypes();
        this.loadEquivalentItems();
    },
    mounted: function () {
    },
    watch: {
        fitMultiplier: function () {

            if (this.fitMultiplier == null)
                this.fitMultiplier = 1;

            this.calculateList();
        },
        resultText: function () {
            if (this.resultText == '') {
                this.resultTypes = [];
                this.coveredList = [];
                this.estimatedPrice = 0;
            }

            // if(this.resultText !== '')
            //     this.calculateTotalPrice();
        }
    },
    methods: {
        loadTypes: function () {

            var $that = this;
            $.getJSON('GetMarketTypes', null, function (data) {
                $that.marketTypes = data;
            });
        },
        loadEquivalentItems: function () {
            var $that = this;
            $.getJSON('GetItemEquivalences', null, function (data) {
                $that.equivalentItems = data;
            });
        },
        findEquivalentItem: function (fitItemId, assetArr) {
            // Check if this item has any equivalents
            if (!this.equivalentItems[fitItemId]) {
                return null;
            }

            // Get the list of equivalent item IDs
            var equivalentIds = this.equivalentItems[fitItemId];

            // Search for any equivalent item with available quantity in the asset list
            for (var i = 0; i < equivalentIds.length; i++) {
                var equivalentId = equivalentIds[i];
                var asset = _.find(assetArr, function (ass) {
                    return ass.id === equivalentId && ass.quantity > 0;
                });

                if (asset) {
                    return asset;
                }
            }

            return null;
        },
        // calculateTotalPrice: function () {
        //     var $that = this;
        //     var ids = _.map(this.resultTypes, function (t) { return t.id; }).join(',');

        //     $that.estimatedPrice = 0;

        //     var total = 0;
        //     $.getJSON('../Ship/GetBulkMarketTypePrice?marketTypeIDs=' + ids + '&_t=' + (new Date()).getTime(), null, function (data) {
        //         _.each(data, function (res) {
        //             var item = _.find($that.resultTypes, function (rt) { return rt.id = res.MarketTypeID; });
        //             total += (item.multiplier * res.Price);
        //         });

        //         $that.estimatedPrice = total;
        //     });
        // },
        onAssetInput: function (evt) {
            this.assetArr = parseFitText(this.assetText, this.marketTypes, true);
            this.calculateList();
        },
        onFitInput: function (evt) {
            this.fitArr = parseFitText(this.fitText, this.marketTypes, true);
            this.calculateList();
        },
        calculateList: function () {
            if (this.assetArr.length !== 0 && this.fitArr.length !== 0) {

                var strBld = '';
                this.coveredList = [];
                this.resultTypes = [];

                var $that = this;

                // Create working copy of inventory
                var inventory = _.map(this.assetArr, function(asset) {
                    return {
                        id: asset.id,
                        name: asset.name,
                        quantity: asset.multiplier
                    };
                });

                // Track what's still needed for each requested item
                var requestedItems = _.map(this.fitArr, function(fit) {
                    return {
                        id: fit.id,
                        name: fit.name,
                        stillNeeded: fit.multiplier * $that.fitMultiplier
                    };
                });

                // PASS 1: Handle exact matches first
                _.each(requestedItems, function(request) {
                    if (request.stillNeeded <= 0) return;

                    var asset = _.find(inventory, function (item) {
                        return item.id == request.id;
                    });

                    if (asset) {
                        var quantityUsed = Math.min(request.stillNeeded, asset.quantity);

                        $that.coveredList.push({
                            id: request.id,
                            name: request.name,
                            quantity: quantityUsed
                        });

                        asset.quantity -= quantityUsed;
                        request.stillNeeded -= quantityUsed;
                    }
                });

                // PASS 2: Handle equivalent items for remaining needs
                _.each(requestedItems, function(request) {
                    while (request.stillNeeded > 0) {
                        var asset = $that.findEquivalentItem(request.id, inventory);

                        if (!asset) break;

                        var displayName = asset.name + ' (subs ' + request.name + ')';
                        var quantityUsed = Math.min(request.stillNeeded, asset.quantity);

                        $that.coveredList.push({
                            id: request.id,
                            name: displayName,
                            quantity: quantityUsed
                        });

                        asset.quantity -= quantityUsed;
                        request.stillNeeded -= quantityUsed;
                    }
                });

                // Build result text from covered items
                _.each(this.coveredList, function(item) {
                    strBld += item.name + ' x' + item.quantity + '\n';
                });

                this.resultText = strBld;

                if (this.resultText == '')
                    this.resultText = '(No Items Needed)';
            }
            else {
                this.resultText = '';
            }
        },
        addCommas: function (num) {
            return numeral(num).format('0,0');
        },
    }
}