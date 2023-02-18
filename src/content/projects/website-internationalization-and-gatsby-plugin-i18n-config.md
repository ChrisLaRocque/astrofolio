---
title: Website internationalization and gatsby-plugin-i18n-config
description: I wanted to get a better understanding of how the 'pro' sites do localization, while building a Gatsby plugin that tries to emulate Next's i18n config.
site: https://github.com/ChrisLaRocque/gatsby-plugin-i18n-config
tech: [nodejs]
---

## TLDR

-   While Google doesn’t have a preference, using subdirectories to specify internationalization (gatsby.com/en-us vs gatsby.com/fr-CA) will prevent having to modify down the road if site localization needs get to that point.
-   Using a CMS with built-in localization capabilities will get you farther faster.
-   Use `rel=”alternate”` links to tell Google about the alternate versions of your page as [outlined by Google](https://developers.google.com/search/docs/specialty/international/localized-versions#html) as well as `rel=”canonical”` where applicable.
-   The URL and HTML `lang` attribute are indicators but Google fundamentally uses your page content to infer the language of the page

## Considerations

### URL structure for internationalization

Pulled from [https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#locale-specific-urls](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#locale-specific-urls)

Google (I believe) states that the URL is not used to infer anything about the locale information, rather the actual content on the page is analyzed

#### Multilingual vs multi-regional vs both

**Multi-regional** is best illustrated when using country-code TLDs, such as [example.uk](http://example.uk) vs [example.ca](http://example.ca). Both sites could theoretically be in English, just with content distinguished for their region. The important distinction is that ccTLDs are _country-code_ TLDs, meaning they specify a region and not a lang.

**Multilingual** could be illustrated via routes for each language, such as [example.com/en](http://example.com/en) vs [example.com/ko](http://example.com/ko).

**For full distinction when both are needed**, its logical to use the full 4 letter lang + country code, especially for countries with multiple languages like [example.com/en-ca](http://example.com/en-ca) vs [example.com/fr-ca](http://example.com/fr-ca)

#### Country-code top-level domains (domain.uk)

Country-code top-level domains are commonly abbreviated ccTLDs. Would require 1 site per language/domain. Domain codes are meant to be country-specific, so doesn’t easily allow for multiple langs in one country. You also need to purchase each domain and provision each domain an SSL cert. Certain ccTLDs are recognized by Google, others have been used more generally (.tv, .me) and as such are considered top-level domains not tied to their country.

#### Subdomains (uk.domain.com)

Requires 1 site per language/region. Google doesn’t infer target audience from subdomains.

#### Subdirectories (domain.com/en-GB/)

Easy to internationalize site via filesystem routing API.

### Using a CMS is easier than not using one

Several CMS’s come ‘out of the box’ with localization, allowing users to work on the same content across multiple locales. Leveraging a CMS that allows you to get localized versions of content back will, naturally, get you further faster in translating your web pages.

## Best practices

### Use alt links to specify all the versions of a page

```html
<link rel="alternate" href="https://example.com/en-gb" hreflang="en-gb" />
<link rel="alternate" href="https://example.com/en-us" hreflang="en-us" />
<link rel="alternate" href="https://example.com/en-au" hreflang="en-au" />
<link
	rel="alternate"
	href="https://example.com/country-selector"
	hreflang="x-default"
/>
```

`x-default` is used to specify a fallback if your site doesn’t have the user’s language.

[https://developers.google.com/search/docs/specialty/international/localized-versions#html](https://developers.google.com/search/docs/specialty/international/localized-versions#html)

### Use canonical links when content is duplicated

[As outlined by Googl](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#dup-content)e, use `rel="canonical"` when content is duplicated. For example your en-GB and en-US sites may both use the same content on the `/about` page, and as such a ‘preferred’ page should be chosen to be the canonical link on both.

## Things to avoid

### Storing translation info in state and/or URL params

Google's docs specifically say this is a bad call.

### Text on images

Even with a CDN that can return localized assets, there’s an inherent overhead that comes with maintaining internationalized assets.

## How other sites do it

Interestingly when using 2 levels of the filesystem for country + language respectively, these sites have their order flipped compared to the syntax for `hreflang` attributes (`en-US` vs `/us/en/`)

### Apple

.com is US, regions/countries are subdirectories using 2-letter country code. Countries with multiple langs are `/country/lang`

[apple.com](http://apple.com) - US

[apple.com/uk/](http://apple.com/uk/) - UK

[https://www.apple.com/ca/fr/](https://www.apple.com/ca/fr/) - Canada (french)

### Facebook

.com is US, 4-letter subdomains for rest

[https://www.facebook.com/](https://www.facebook.com/) - US

[https://pt-br.facebook.com/](https://pt-br.facebook.com/) - Portuguese (Brazil)

### Amazon

ccTLDs for regions, language set by URL params

[https://www.amazon.com/](https://www.amazon.com/) - US (english)

[https://www.amazon.com/?language=es_US](https://www.amazon.com/?language=es_US) - US (Spanish)

[https://www.amazon.ca/?language=en_CA](https://www.amazon.ca/?language=en_CA) - Canada (English)

### Nike

.com is US english, 1st level subdirectory is country code, then language if more than 1.

[https://www.nike.com/](https://www.nike.com/) - US (English)

[https://www.nike.com/ca](https://www.nike.com/ca) - Canada (English)

[https://www.nike.com/ca/fr](https://www.nike.com/ca/fr) - Canada (French)

## References

### Helpful Links

[https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### Terminology + standards

**ISO 3166-1 alpha-2** - 2-letter country codes [https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

**ISO 639-1** - 2-letter language codes [https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

**Country-code top-level domains** - Also called ccTLDs, delegated top-level domain endings to specify the country a site is tailored to. [https://en.wikipedia.org/wiki/Country_code_top-level_domain](https://en.wikipedia.org/wiki/Country_code_top-level_domain)
