# Internationalization (i18n) Setup

This application uses [i18next](https://www.i18next.com/) for internationalization support, enabling bilingual content delivery in English and Welsh.

## Directory Structure

```
server/
  i18n/
    index.ts                    # i18n configuration
    helpers.ts                  # Server-side translation helpers
    locales/
      en/                       # English translations
        common.json             # Shared UI elements
        pages.json              # Page-specific content
        features.json           # Components & features
        errors.json             # Error messages
      cy/                       # Welsh translations
        common.json
        pages.json
        features.json
        errors.json
```

## Configuration

The i18n setup includes:

- **Supported languages**: English (en), Welsh (cy)
- **Default language**: English (en)
- **Detection order**: Query string → Cookie → HTTP header
- **Cookie name**: `lang`
- **Namespaces**: `common`, `pages`, `features`, `errors`
- **Backend**: i18next-fs-backend (file system)
- **Middleware**: i18next-http-middleware

## Language Detection

The application detects the user's language preference in the following order:

1. **Query string**: `?lng=cy` or `?lng=en`
2. **Cookie**: The `lang` cookie value
3. **Accept-Language header**: Browser language preference

## Usage in Routes

In your Express routes, use `req.t()` to translate text:

```typescript
router.get("/", (req, res) => {
  const title = req.t("common:topBar.title");
  res.render("pages/index", { title });
});
```

Access current language:

```typescript
const currentLanguage = req.language; // 'en' or 'cy'
```

## Usage in Nunjucks Templates

Use the global `t` function in your templates:

```nunjucks
<h1>{{ t('common:topBar.title') }}</h1>
<p>{{ t('features:contentTile.new') }}</p>
<a href="/">{{ t('common:pageNavigation.home') }}</a>
```

Access the current language:

```nunjucks
<html lang="{{ language }}">
```

The middleware automatically exposes these to templates:
- `t` - Translation function
- `i18n` - i18next instance
- `language` - Current language code

## Adding Translations

### Step 1: Add to English translation file

Choose the appropriate namespace file:

**For shared UI elements** - Edit `server/i18n/locales/en/common.json`:

```json
{
  "skipToMainContent": "Skip to main content",
  "footer": {
    "privacy": "Privacy"
  }
}
```

**For error messages** - Edit `server/i18n/locales/en/errors.json`:

```json
{
  "error": {
    "pageNotFound": "Page not found"
  }
}
```

**For features/components** - Edit `server/i18n/locales/en/features.json`:

```json
{
  "contentTile": {
    "new": "NEW",
    "read": "Read"
  }
}
```

### Step 2: Add Welsh translation

Add corresponding Welsh translations in the same namespace file:

**Example** - Edit `server/i18n/locales/cy/common.json`:

```json
{
  "skipToMainContent": "Neidio i'r prif gynnwys",
  "footer": {
    "privacy": "Preifatrwydd"
  }
}
```

### Step 3: Use in code

```typescript
// In routes
req.t("common:skipToMainContent");
req.t("errors:error.pageNotFound");
req.t("features:contentTile.new");
```

```nunjucks
{# In templates #}
{{ t('common:skipToMainContent') }}
{{ t('errors:error.pageNotFound') }}
{{ t('features:contentTile.new') }}
```

## Interpolation

You can use dynamic values in translations:

```json
{
  "welcome": "Welcome, {{name}}!",
  "interstitial": {
    "message": "You are being taken to {{url}}. You are <strong>allowed</strong> to visit this website."
  }
}
```

Usage:

```typescript
req.t("common:welcome", { name: "John" });
req.t("features:interstitial.message", { url: "example.com" });
```

Note: HTML in translations is not escaped by default (`escapeValue: false` in config).

## Server-Side Translation Helpers

The `helpers.ts` file provides utilities for server-side translations:

```typescript
import { getServerTranslation, translate, translationExists } from './i18n/helpers';

// Get a fixed translation function for a specific language
const t = getServerTranslation('cy');
const title = t('common:topBar.title');

// Translate without request context
const text = translate('common:skipToMainContent', { lng: 'en' });

// Check if a translation key exists
if (translationExists('common:myKey', 'cy')) {
  // Translation exists
}
```

## Namespaces

Translations are organized into namespaces for better structure:

- **`common`**: Shared UI elements (skip links, top bar, footer, page navigation)
- **`pages`**: Page-specific content (home, search, category pages, etc.)
- **`features`**: Components & features (content tiles, banners, interstitial, show more, etc.)
- **`errors`**: Error messages and error page content

The default namespace is `common`, so you can omit the prefix for common translations:

```typescript
req.t('skipToMainContent') // Uses common namespace
req.t('common:skipToMainContent') // Explicit (same result)
req.t('errors:error.pageNotFound') // Must specify for other namespaces
```

Create additional namespaces by adding new JSON files in both `locales/en/` and `locales/cy/` directories.

## Language Switcher

To add a language switcher, create links that set the language:

```nunjucks
<a href="?lng=en">English</a>
<a href="?lng=cy">Cymraeg</a>
```

Or use a form:

```nunjucks
<form method="get">
  <select name="lng" onchange="this.form.submit()">
    <option value="en" {% if language == 'en' %}selected{% endif %}>English</option>
    <option value="cy" {% if language == 'cy' %}selected{% endif %}>Cymraeg</option>
  </select>
</form>
```

## Testing

When testing routes that use translations:

```typescript
import i18next from "../i18n";

beforeAll(async () => {
  // Ensure i18next is initialized before tests
  await i18next.isInitialized;
});

test("should display translated text", () => {
  const translated = i18next.t("common:topBar.title");
  expect(translated).toBe("Content Hub");
});

test("should translate with interpolation", () => {
  const translated = i18next.t("features:interstitial.message", { 
    url: "example.com" 
  });
  expect(translated).toContain("example.com");
});
```

## Middleware Setup

The i18n middleware is configured in `server/middleware/setUpI18n.ts` and automatically:
- Detects and sets the user's language preference
- Exposes translation functions to routes (`req.t`, `req.i18n`, `req.language`)
- Makes translations available in Nunjucks templates (`t`, `i18n`, `language`)

The middleware is applied globally in the application setup.

## Environment Variables

- **`NODE_ENV=production`**: Disables debug mode for i18next
- **`NODE_ENV=development`**: Enables debug logging for translation loading and missing keys

No additional environment variables required for i18n functionality.

## Implementation Details

The i18n configuration (`server/i18n/index.ts`) includes:
- Preloading of both English and Welsh translations
- File system backend for loading translation files
- HTTP middleware for language detection
- Debug mode in non-production environments
- Disabled `saveMissing` to prevent automatic creation of missing translation files

## Further Reading

- [i18next Documentation](https://www.i18next.com/)
- [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware) - Express middleware
- [i18next-fs-backend](https://github.com/i18next/i18next-fs-backend) - File system backend
