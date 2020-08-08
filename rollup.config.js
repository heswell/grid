import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy'

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
        input: 'empty.js',
        plugins: [
            resolve({
                preferBuiltins: false
            }),
            commonjs(),
            copy({
                targets: [
                    {src: './node_modules/@heswell/worker/dist/worker-local-model.js', dest: 'public', rename: 'worker.js'},
                    {src: './node_modules/@heswell/worker/dist/worker-local-model.js.map', dest: 'public', rename: '/worker.js.map'},
                    {src: './src/data-tables/*', dest: 'public/tables'}
                ]
            })
        ]
    },
];
