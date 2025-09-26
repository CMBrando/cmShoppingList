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
            estimatedPrice: 0
        };
    },
    props: ['string'],
    created: function () {
        this.loadTypes();
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

                _.each(this.fitArr, function (fit) {

                    var itemTotal = (fit.multiplier * $that.fitMultiplier);

                    var asset = _.find($that.assetArr, function (ass) { return ass.id == fit.id; });
                    if (asset == null) {
                        strBld += fit.name + ' x' + itemTotal + '\n';
                        $that.resultTypes.push({ id: fit.id, multiplier: itemTotal });
                    }
                    else {
                        // if fit amount is greater than asset add diff
                        if (itemTotal > asset.multiplier) {
                            strBld += fit.name + ' x' + (itemTotal - asset.multiplier) + '\n';
                            $that.resultTypes.push({ id: fit.id, multiplier: (itemTotal - asset.multiplier) });
                            $that.coveredList.push({ id: fit.id, name: fit.name, multiplier: asset.multiplier });
                        }
                        else {
                            $that.coveredList.push({ id: fit.id, name: fit.name, multiplier: itemTotal });
                        }
                    }

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





