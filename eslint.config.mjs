import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '_chat/**']
  },

  // 文件匹配与全局变量配置
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,  // 浏览器环境变量（window、document 等）
        uni: 'readonly',     // uni-app 全局对象（只读）
        wx: 'readonly',      // 微信小程序全局对象（只读）
        process: 'readonly'  // Node.js 进程对象（只读）
      }
    }
  },

  // 应用规则集
  js.configs.recommended,
  ...pluginVue.configs['flat/essential']
]
