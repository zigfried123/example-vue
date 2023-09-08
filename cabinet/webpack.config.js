let path = require('path');
let webpack = require('webpack');
let LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
let AssetsPlugin = require('assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        navbar: "./entries/common/components/navbar.js",
        navbar_min: "./entries/common/components/navbar_min.js",
        tree: "./entries/common/components/tree.js",
        codegenerator: "./entries/common/components/codegenerator.js",
        grid: "./entries/common/components/grid.js",
        AppResolveConversionsSettlements: "./entries/manager/accountingDocuments/resolveConversionsSettlements.js",
        AppAgentBonus: "./entries/manager/accountingDocuments/agentBonus.js",
        AgentNdsRefund: "./entries/manager/accountingDocuments/agentNdsRefund.js",
        AppAgentTransit: "./entries/manager/accountingDocuments/agentTransit.js",
        AppAgentTransitNew: "./entries/manager/accountingDocuments/agentTransitNew.js",
        AppResetAffiliateBalance: "./entries/manager/accountingDocuments/resetAffiliateBalanceNew.js",
        AgentToBalance: "./entries/manager/accountingDocuments/agentToBalance.js",
        AppAgentOutcomeBonus: "./entries/manager/accountingDocuments/agentOutcomeBonus.js",
        AppNettingAffiliateAdvertiser: "./entries/manager/accountingDocuments/nettingAffiliateAdvertiser.js",
        AppAffiliateBonus: "./entries/manager/accountingDocuments/affiliateBonus.js",
        AppAdvertiserBonus: "./entries/manager/accountingDocuments/advertiserBonus.js",
        AdvertiserApproveCancellation: "./entries/manager/accountingDocuments/advertiserApproveCancellation.js",
        AppAffiliateApproveCancellation: "./entries/manager/accountingDocuments/affiliateApproveCancellation.js",
        AppTransferAffiliateBalance:  "./entries/manager/accountingDocuments/transferAffiliateBalance.js",
        AppTransferAffiliateBalanceNew:  "./entries/manager/accountingDocuments/transferAffiliateBalanceNew.js",
        AppResetSystemBalance: './entries/manager/accountingDocuments/resetSystemBalance.js',
        AppAdvertiserInvoice: "./entries/manager/accountingDocuments/advertiserInvoice.js",
        AppAffiliateOrganizationConversionsDelivery: "./entries/manager/accountingDocuments/affiliateOrganizationConversionsDelivery.js",
        AppAffiliateSelfEmployedConversionsDelivery: "./entries/manager/accountingDocuments/affiliateSelfEmployedConversionsDelivery.js",
        AppAffiliateBalanceFreezing: "./entries/manager/accountingDocuments/affiliateBalanceFreezing.js",
        AppAffiliateBalanceUnFreezing: "./entries/manager/accountingDocuments/affiliateBalanceUnFreezing.js",

        AppBankAccount: "./entries/common/contractors/selfEmployed/bankAccounts.js",
        AppManagerSelfEmployedView: "./entries/manager/contractors/selfEmployed/view.js",
        AppWebmasterSelfEmployedView: "./entries/webmaster/contractors/selfEmployed/view.js",
        AppManagerSelfEmployedCreate: "./entries/manager/contractors/selfEmployed/create.js",
        AppWebmasterSelfEmployedCreate: "./entries/webmaster/contractors/selfEmployed/create.js",

        financePaymentAccounts: "./entries/common/components/financePaymentAccounts.js",
        financeAffiliateDashboard: "./entries/common/components/financeAffiliateDashboard.js",
        tickets: "./entries/common/components/tickets.js",
        AppClicksGenerator: "./entries/manager/trafficGenerator/clicksGenerator.js",
        AppConversionsGenerator: "./entries/manager/trafficGenerator/conversionsGenerator.js",

        AppPaymentCalendar: "./entries/manager/calendar/payment/calendar.js",
        AppHoldCalendar: "./entries/manager/calendar/hold/calendar.js"
    },
    output: {
        path: path.resolve(__dirname, './../public_html/vue'),
        publicPath: '/vue/',
        filename: "[name].js?hash=[chunkhash:6]"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]((?!(element-ui)).*)[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all'
                },
                vendorElementUi: {
                    test: /[\\/]element-ui[\\/]/,
                    name: 'vendor-element-ui',
                    enforce: true,
                    chunks: 'all'
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                'options': {
                    'plugins': ['lodash'],
                    'presets': [['@babel/preset-env', { 'modules': false, 'targets': { 'node': 4 } }]]
                }
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader']},
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        allowedHosts: [
            '.alexanderl.leads'
        ],
    },
    performance: {
        hints: false
    },
    devtool: '#eval',
    plugins: [
        new AssetsPlugin({
            filename: 'assets.json',
            path: path.resolve(__dirname, './../public_html/vue'),
        }),
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'none';

    module.exports.optimization.minimizer = (module.exports.optimization.minimizer || []).concat([
        new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            cache: true,
            parallel: true,
            sourceMap: false,
        }),
    ]);

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new LodashModuleReplacementPlugin,
    ]);
}
