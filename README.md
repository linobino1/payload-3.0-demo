# i18n isssues

## 1. `en` must always be included in the `supportedLanguages` config, otherwise there will be an error in `getTranslationsByContext()`.

### Reproduce

remove `en` from `supportedLanguages` in `payload.config.ts` and run the app.

## 2. Namespaces do not work

TypeScript asks for a namespace in the `translations` object, but the `t` function can only find translations without a namespace.

### Reproduce

1. run the app
1. navigate to a user document
1. open the console and you will see that only the translation for the key without namespace was found.

## 3. Nested namespaces do not work

### Reproduce

same as above
