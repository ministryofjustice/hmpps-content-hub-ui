# Internationalization (i18n) Setup

This application uses [i18next](https://www.i18next.com/) for internationalization support.

## Directory Structure

```
server/
  i18n/
    index.ts                    # i18n configuration
    locales/
      en/                       # English translations
        common.json             # Shared UI elements
        pages.json              # Page-specific content
        features.json           # Components & features
      cy/                       # Welsh translations
        common.json
        pages.json
        features.json
```

## Configuration

The i18n setup includes:

- **Supported languages**: English (en), Welsh (cy)
- **Default language**: English (en)
- **Detection order**: Query string → Cookie → HTTP header
- **Cookie name**: `lang`
- **Namespaces**: `common`, `pages`, `features`

## Language Detection

The application detects the user's language preference in the following order:

1. **Query string**: `?lng=cy` or `?lng=en`
2. **Cookie**: The `lang` cookie value
3. **Accept-Language header**: Browser language preference

## Usage in Routes

In your Express routes, use `req.t()` to translate text:

```typescript
router.get("/", (req, res) => {
  const welcomeMessage = req.t("common:serviceName");
  res.render("pages/index", { welcomeMessage });
});
```

## Usage in Nunjucks Templates

Use the global `t` function in your templates:

```nunjucks
<h1>{{ t('common:serviceName') }}</h1>
<button>{{ t('common:buttons.continue') }}</button>
```

Access the current language:

```nunjucks
<html lang="{{ language }}">
```

## Adding Translations

### Step 1: Add to English translation file

Edit `server/i18n/locales/en/common.json`:

```json
{
  "myKey": "My translation text",
  "nested": {
    "key": "Nested value"
  }
}
```

### Step 2: Add Welsh translation

Edit `server/i18n/locales/cy/common.json`:

```json
{
  "myKey": "Fy nhestun cyfieithiad",
  "nested": {
    "key": "Gwerth nythog"
  }
}
```

### Step 3: Use in code

```typescript
// In routes
req.t("common:myKey");
req.t("common:nested.key");
```

```nunjucks
{# In templates #}
{{ t('common:myKey') }}
{{ t('common:nested.key') }}
```

## Interpolation

You can use dynamic values in translations:

```json
{
  "welcome": "Welcome, {{name}}!",
  "itemCount": "You have {{count}} items"
}
```

Usage:

```typescript
req.t("common:welcome", { name: "John" });
req.t("common:itemCount", { count: 5 });
```

## Namespaces

Translations are organized into namespaces:

- `common`: Shared UI elements (navigation, footer, skip to content)
- `pages`: Page-specific content (home, search, errors)
- `features`: Components & features (feedback, games, content tiles, etc.)

Create additional namespaces by adding new JSON files in the locale directories.

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
  await i18next.isInitialized;
});

test("should display translated text", () => {
  const translated = i18next.t("common:serviceName");
  expect(translated).toBe("HMPPS Content Hub UI");
});
```

## Environment Variables

- `NODE_ENV=production`: Disables debug mode and enables caching
- No additional environment variables required for basic functionality

## Further Reading

- [i18next Documentation](https://www.i18next.com/)
- [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware)
- [i18next-fs-backend](https://github.com/i18next/i18next-fs-backend)
