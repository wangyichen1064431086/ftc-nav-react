import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/js/Nav.js',
  output:[
    {
      name:'FtcNav',
      sourcemap: true,
      
      globals:{
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      
      file: './build/index.js',
      format: 'umd'
      
    },
    {
      name:'FtcNav',
      sourcemap: true,
      
      globals:{
        react: 'React',
        'react-dom': 'ReactDOM'
      },

      file: './build/index.es.js',
      format: 'es'
    },
  ],


  plugins: [
    
    postcss({
      modules: true
    }),
    
    babel({
      exclude: 'node_modules/**'
    }),
    /*
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    */
    resolve({
      jsnext: true,
      main:true
    }),
    commonjs({
      /*
      namedExports: {
        'node_modules/immutable/dist/immutable.js':['Seq']
      }
      */
    })
  ],

  external: ['react', 'react-dom'],

  
}