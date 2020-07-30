import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
    // {
    //     input: 'src/index.jsx',
    //     output: {
    //         file: 'lib/index.js',
    //         format: 'es',
    //         sourcemap: true
    //     }
    // },
    {
        input: './src/worker.js',
        output: {
            file: 'public/worker.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve({
                preferBuiltins: false
            }),
            commonjs()
        ]
    },
];
