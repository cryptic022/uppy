/* global jest:false, test:false, expect:false, describe:false, beforeEach:false */

const providerManager = require('../../src/server/provider')
let grantConfig
let companionOptions

describe('Test Provider options', () => {
  beforeEach(() => {
    grantConfig = require('../../src/config/grant')()
    companionOptions = require('../../src/standalone/helper').getCompanionOptions()
  })

  test('adds provider options', () => {
    providerManager.addProviderOptions(companionOptions, grantConfig)
    expect(grantConfig.dropbox.key).toBe('dropbox_key')
    expect(grantConfig.dropbox.secret).toBe('dropbox_secret')

    expect(grantConfig.google.key).toBe('google_key')
    expect(grantConfig.google.secret).toBe('google_secret')

    expect(grantConfig.instagram.key).toBe('instagram_key')
    expect(grantConfig.instagram.secret).toBe('instagram_secret')
  })

  test('adds provider options for secret files', () => {
    process.env.COMPANION_DROPBOX_SECRET_FILE = process.env.PWD + '/test/resources/dropbox_secret_file'
    process.env.COMPANION_GOOGLE_SECRET_FILE = process.env.PWD + '/test/resources/google_secret_file'
    process.env.COMPANION_INSTAGRAM_SECRET_FILE = process.env.PWD + '/test/resources/instagram_secret_file'

    companionOptions = require('../../src/standalone/helper').getCompanionOptions()

    providerManager.addProviderOptions(companionOptions, grantConfig)

    expect(grantConfig.dropbox.secret).toBe('xobpord')
    expect(grantConfig.google.secret).toBe('elgoog')
    expect(grantConfig.instagram.secret).toBe('margatsni')
  })

  test('does not add provider options if protocol and host are not set', () => {
    delete companionOptions.server.host
    delete companionOptions.server.protocol

    providerManager.addProviderOptions(companionOptions, grantConfig)
    expect(grantConfig.dropbox.key).toBeUndefined()
    expect(grantConfig.dropbox.secret).toBeUndefined()

    expect(grantConfig.google.key).toBeUndefined()
    expect(grantConfig.google.secret).toBeUndefined()

    expect(grantConfig.instagram.key).toBeUndefined()
    expect(grantConfig.instagram.secret).toBeUndefined()
  })

  test('sets a master redirect uri, if oauthDomain is set', () => {
    companionOptions.server.oauthDomain = 'domain.com'
    providerManager.addProviderOptions(companionOptions, grantConfig)

    expect(grantConfig.dropbox.redirect_uri).toBe('http://domain.com/dropbox/redirect')
    expect(grantConfig.google.redirect_uri).toBe('http://domain.com/drive/redirect')
    expect(grantConfig.instagram.redirect_uri).toBe('http://domain.com/instagram/redirect')
  })
})

describe('Test Custom Provider options', () => {
  test('adds custom provider options', () => {
    const providers = providerManager.getDefaultProviders()
    providerManager.addCustomProviders({
      foo: {
        config: {
          key: 'foo_key',
          secret: 'foo_secret'
        },
        module: jest.mock()
      }
    }, providers, grantConfig)

    expect(grantConfig.foo.key).toBe('foo_key')
    expect(grantConfig.foo.secret).toBe('foo_secret')
    expect(providers.foo).toBeTruthy()
  })
})
