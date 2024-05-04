import path from 'path'
// import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from 'payload/i18n/en'
import { de } from 'payload/i18n/de'
import {
  AlignFeature,
  BlockQuoteFeature,
  BlocksFeature,
  BoldFeature,
  CheckListFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
//import { slateEditor } from '@payloadcms/richtext-slate'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload/config'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    // this does not work:
    // supportedLanguages: { de },
    // en must be included in supportedLanguages, otherwise an error will be thrown
    supportedLanguages: { en, de },
    translations: {
      en: {
        // @ts-expect-error - typescript wants me to use a namespace
        key: 'This is a key without a namespace',
        namespace: {
          key: 'This is a key within a namespace',
          // @ts-expect-error - type doesn't allow nesting
          nested: {
            key: 'This is a nested key within a namespace',
          },
        },
      },
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      hooks: {
        afterRead: [
          async ({ req: { t, i18n } }) => {
            console.log('----------------------------------------------')
            console.log('i18n.language', i18n.language)
            console.log('\n')
            console.log('Key without namespace: ', t('key'))
            console.log('\n')
            console.log('Key within namespace: ', t('namespace.key'))
            console.log('\n')
            console.log('Nested key: ', t('namespace.nested.key'))
          },
        ],
      },
      fields: [],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),

  admin: {
    autoLogin: {
      email: 'dev@payloadcms.com',
      password: 'test',
      prefillOnly: true,
    },
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  sharp,
})
