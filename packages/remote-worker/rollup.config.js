import * as path from 'path';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import { commonJsConfig } from "../../rollup/config";

const config = {
  input: path.resolve(__dirname, "./src/worker.js"),
  output: {
    file: path.resolve(__dirname,"../app/public/worker.js"),
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve({
      preferBuiltins: false,
    }),
    commonjs(commonJsConfig),
    filesize()
  ]
};

export default config;
