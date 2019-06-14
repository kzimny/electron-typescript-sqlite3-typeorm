const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

/**
 * The webpack configuration settings specific to the `main` compiler.
 *
 * @type {webpack.Configuration}
 */
const config = {
    entry: './src/main/index.ts',
    externals: {
        typeorm: 'typeorm',
        sqlite3: 'sqlite3',
    },
    plugins: [
        //ignore the drivers you don't want. This is the complete list of all drivers -- remove the suppressions for drivers you want to use.
        new FilterWarningsPlugin({
            exclude: [/mongodb/, /mssql/, /mysql/, /mysql2/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /redis/, /react-native-sqlite-storage/, /sql.js/]
        })
    ],
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.(m?js|node)$/,
                parser: { amd: false },
                use: {
                    loader: '@marshallofsound/webpack-asset-relocator-loader',
                    options: {
                    outputAssetBase: 'native_modules',
                    },
                }
            }
        ]
    }
};

module.exports = merge(common, config);
