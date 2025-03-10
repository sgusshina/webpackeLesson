const path = require('path') // импортируем путь

const HtmlWebpackPlugin = require("html-webpack-plugin") // регистрация плагина по созданию index.html, связанного с bundle.js
const CopyPlugin = require("copy-webpack-plugin") // регистрация плагина переноса файлов из одной папки в другую без изменений
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // регистрация плагина, который указывает, какие файлы нужно добавить в главный css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // регистрация плагина, который будет минифицировать все файды css в один главный

const isProduction = process.env.NODE_ENV === 'production' // задаем переменную, отвечающую за состояние проекта (переменная окружения)

module.exports = {
    entry: './index.js', // указываем тиочку входа, откуда начнется оптимизация (первый файл, по которому пройдет вебпак)
    mode: isProduction ? 'production' : 'development', // указываем состояние проекта: разработка или готовый продукт для пользователя
    output: { // указываем точку выхода, где будут собираться все собранные файлы
        path: path.resolve(__dirname, 'dist'), // указываем папку, в которой будут собираться файлы
        filename: 'bundle.js', // указываем имя файла, где будут собраны все файлы js
        clean: true, // перед сбором чистим старый собранный код, чтобы не было повторений и ошибок
      },
    module: { // прописываем модули - лоадеры, которые смогут обрабатывать файлы другого расширения, не только js и json, как по умолчанию заложено в webpack
        rules: [ // прописываем условия работы модулей
            {
                test: /\.css$/, // указываем расширение файлов, с которым может работать лоадер (все файлы с расширением .css)
                use: [MiniCssExtractPlugin.loader,"css-loader"] // лоадер, который будет собирать стиль всех файлов css в один и добавлять в атрибут style на html-странице
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i, // все файлы с перечисленными расширениями
                type: "asset/resource" // лоадер для работы с изображениями по умолчнию встроен в webpack, поэтому мы указываем тип лоадера
            },
            {
                test: /\.(woff|woff2|eot)$/i, // все встроенные шрифты
                type: "asset/resource" // лоадер для работы со шрифтами
            }
        ],
    },
    plugins: [ // здесь хранятся все плагины
        new CopyPlugin ({ // добавляем плагины
            patterns:[{from: "static", to: "staticNew"}] // передаем откуда перенести и в какую папку
        }),
        new HtmlWebpackPlugin({ // добавляем плагин
        template:'./index.html' // передача страницы html в плагин (говорим, какая страница будет связана с файлом buhdle.js)
    }),
        new MiniCssExtractPlugin()], // добавляем плагин
    optimization:
    {
        minimizer:["...", new CssMinimizerPlugin()] // передаем, что будет делаться во время оптимизации // во время оптимизации будет происходит все по заводским настройкам webpack и срабатывать плагин оптимизация css 
    },
    devtool: isProduction  ? "hidden-source-map" : "source-map" // добавляем source-maps для вычисления, в каком конкретно файле была допущена ошибка, и отключаем sm в режиме запуска продукта 
}


//комментарии к package.json: 
// добавляем в скрипты команды для запуска webpack и для запуска сервера (страницы localhost)

// комментарии к работе webpack
// wp будет собирать проект в папку dist при команде nm run build в следующей последовательности:
// - поймет, какое у проекта состояние: разработка или действующий продукт
// - зайдет в файл index.js и возьмет оттуда все скрипты + если там есть import из других файлов, то учтет их при работе кода в index.js
// - далее с учетом всех указанных импортов в js он пройдется по этим файлам (указанным в импортах) и применит к ним оптимизацию: все файлы с одинаковыми параметрами соберет в один главный, который создается при реализации лоадера, (то есть все сss в один главный css)
// - далее пройдет по всем указанным лоадерам и плагинам в проекте и соберет все то, что сказано в них: соберет все изображения, перенесет какие-то файлы(чаще всего ими являются изображения, потому что нам не нужно к изображениям применять оптимизацию), затем найдет файл htmщ, название которого указано в плагине создания html, и добавит в него все ссылки на другие основные файлы: css и js
// - далее, после того, как все указанные действия в module.export он сделает, применит для всех указанных файлов оптимизацию и минификацию, он создаст обобщающие файлы и папки (bundle.js - с файлами js; main.css - с файлами css; папку static - со статичными файлами)
// - добавит стили в атрибут style в html, код - в скрипт
// - поместит эти папки и файлы в обобщенную папку dist
// - проверит код на ошибки и выявит их для конкретных файлов с помощью source-map
// - выведет результат

// при запуске npm run server запустит сервер с выведенной созданной страницей index.html


