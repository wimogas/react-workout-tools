const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

module.exports = {
   context: __dirname,
   entry: './src/index.js',
   output: {
      path: path.resolve( __dirname, 'public' ),
      filename: 'main.js',
      publicPath: '/',
   },
   devServer: {
      historyApiFallback: true
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.(js|jsx)$/,
            use: 'babel-loader',
         },
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(png|j?g|gif)?$/,
            use: 'file-loader'
         },
         {
            test: /\.svg$/i,
            use: ['@svgr/webpack'],
         },
         {
            test: /\.s[ac]ss$/i,
            use: ["style-loader", "css-loader", "sass-loader"],
         },
]
   },
   resolve: {
      extensions: ['.tsx', '.ts', '.js'],
   },
   plugins: [
      new HtmlWebPackPlugin({
         template: path.resolve( __dirname, 'src/index.html' ),
         filename: 'index.html'
      })
   ]
};