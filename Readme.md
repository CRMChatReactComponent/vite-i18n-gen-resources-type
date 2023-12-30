# vite-i18n-gen-resources-type

用于生成 i18n 的类型文件和语言 enum;

解决的问题是避免由于翻译文件频繁更新导致每次都要手动更改类型的问题

## 效果

现有以下结构的 i18n 翻译文件

```text
📦locales
 ┣ 📂en-US
 ┃ ┣ 📜translation.json
 ┃ ┗ 📜translation2.json
 ┗ 📂zh-CN
 ┃ ┣ 📜translation.json
 ┃ ┗ 📜translation2.json
```

其中 `locales/zh-CN/translation.json` 的内容如下

```json
{
  "welcome": "你好",
  "nope": "不可以"
}
```

使用 `vite-i18n-gen-resources-type` 插件后，将会按照上面的目录结构生成以下俩文件

### 1. genI18n.resources.d.ts

这个文件的类型描述是根据 `zh-CN` 目录中文件进行生成的，可以通过 `defaultLang` 来配置默认查找的目录名称

```typescript
export interface I18nResourceInterface {
  translation2: {
    welcome2: string;
  };
  translation: {
    welcome: string;
    nope: string;
  };
}
```

### 2. genI18nEnum.ts

```typescript
export enum GenI18nEnum {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}
```

## 结合 i18next

生成这俩文件后，就可以修改 [i18next 的 typescript 定义文件](https://www.i18next.com/overview/typescript#create-a-declaration-file) 成下面这样的

```typescript
import { I18nResourceInterface } from "./langs/genI18n.resources";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nResourceInterface;
  }
}
```

### ？为什么不用官网的例子

```typescript
// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import ns1 from "locales/en/ns1.json";
import ns2 from "locales/en/ns2.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "ns1";
    // custom resources type
    resources: {
      ns1: typeof ns1;
      ns2: typeof ns2;
    };
    // other
  }
}
```

主要还是觉得麻烦，添加一个 json 就要进来改一下，还不如一劳永逸，另外语言 code 的 ENUM 也是自动生成好。

## 使用

```typescript
export default defineConfig({
  plugins: [
    GenI18nTypes({
      //  输入绝对路径
      watchFolder: `${r("src/i18n/locales")}`,
      //  输入绝对路径
      outputFolder: `${r("src/i18n")}`,
    }),
  ],
});
```

## options

```typescript
type Args = {
  //  需要监听的文件夹路径
  watchFolder: string;
  //  需要输出 type 和 enum 文件的文件夹路径
  //  默认：watchFolder 的父目录
  outputFolder?: string;
  //  是否生成 enum 文件
  //  默认: true
  isGenEnumFile?: boolean;
  //  生成的 type 文件名称
  //  默认：genI18n.resources.d.ts
  typesFileName?: string;
  //  生成的 enum 文件名称
  //  默认：genI18nEnum.ts
  enumFileName?: string;
  //  生成 type 时默认的语言目录名称
  //  默认：zh-CN
  defaultLang?: string;
};
```
