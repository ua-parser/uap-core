# ua-parser Specification

Version 0.3 Draft

This document describes the contents of the `regexes.yaml` file and
how it should be used to extract information from user-agent strings.

This document does not prescribe how to actually implement the
ua-parser project, and retrieval of user agent strings itself is out
of scope.

## `regexes.yaml`

`regexes.yaml` is a mapping of a category name to a sequence of
category entries.

Category entries follow the category's schema in order to process user
agent strings and extract the relevant information. Parser categories
are the following:

* The [User Agent](#user-agent) aka “the browser”, under the key
  `user_agent_parsers`
* The [Operating System (OS)](#os), which the User Agent uses (runs
  on), under the key `os_parsers`
* The [Device](#device), the physical device which the User Agent uses
  (runs on), under the key `device_parsers`

Category schemas are series of fields which can be extracted, with the
following attributes:

- a field name (indicative, not notmative)
- a [replacement field](#templated-replacement-fields), which allows
  either statically defining a value, or templating based on extracted
  data
- an optional [capturing group index](#regex), which defines the
  field's value if no replacement is provided (groups are specified
  using 1-indexing from the first capturing group)
- a requirement flag, a required field must either have a non-empty
  capture or a non-empty replacement
- a failure fallback, used for the entire category in case a user
  agent string matched no entry

These elements are used uniformly in order to extract the data
specified by the category. As such, the parsing method can be defined

### Parsing Algorithm

In order to extract data from a user-agent string, for a given
category:

- for each entry, traversed in-order, the `regex` is matched
  (case-sensitive, un-anchored) against the user-agent string
  - at the first matching `regex`,
    - for each field of the category
      - if the field has a replacement
        - [template substitution](#templated-replacement-fields) shall
          be applied, and the result set as the field's value
      - otherwise if the field has a *capturing group* declared, the
        corresponding data shall be set as the field's value
      - otherwise if the field is non-required, its value shall be empty
    - the parser shall successfully return providing the extracted
      field values
- if all parser entries are traversed without finding a match, the
  parser shall abort, returning the `failure` value for each field
  which has one

### Entry Fields

Each parser entry contains:

- a regex regular expression field named `regex`
- a number of templated *replacement fields*

#### `regex`

The regex fields contain a regular expression in perl-compatible
syntax, using a limited subset of the Perl / PCRE syntax:

- the regex are evaluated entirely in ASCII mode
- metacharacters can be escaped using `\` for literal matching
- `.` will match any single character (**TODO**: byte? code unit? codepoint?)
- `^` will match the start of the string exclusively
- `$` will match the end of the string exclusively
- `\d` will match any single ASCII digit (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
- `\w` will match any single ASCII word component (a-zA-Z0-9_)
- `\s` will match any single ASCII whitespace character (space, tab)
- `?` matches 0 or 1 instances of the preceding match-able (optional)
- `*` matches a repetition of 0 to infinite number of the preceding match-able
- `+` matches a repetition of 1 to infinite number of the preceding match-able
- `{a, b}` matches `a` to `b` (inclusive) repetitions of the preceding
  match-able, if `b` is not provided it is equal to `a`
- `[]` enclosing a set of characters or character classes allows
  matching any one of them
  - two characters separated by `-` inside of a set means the range
    between the first and last, inclusive, in ASCII
- `()` matches whatever is contained within defining a *group*, by
  default groups are *capturing groups* and the contents will be extracted
  - `|` provides alternation within a group, that is either side can be matched
  - `?:` makes the group *non-capturing*, meaning the contents will not be extracted

**TODO**: Provide some insights into the used chars. E.g. escape `"."` as `"\."` and `"("` as `"\("`. `"/"` does not need to be escaped.

#### Templated replacement fields

A replacement field can be either a static value, which always
provides the exact value of the corresponding field in case of `regex`
match, or a *template*.

A template contains placeholders `$x` where `x` is a number between 1
and 9.

During the post-processing phase of a `regex` match, each template
placeholder is replaced by the value captured by the corresponding
*capturing group*. If a capturing group did not match, its value
should be `""` (an empty string).

Following template substitution, the replacement value shall be
trimmed (all leading and trailing whitespace removed) before being
returned.

### User Agent

| field        | replacement        | group | required | failure |
|--------------|--------------------|-------|----------|---------|
| family       | family-replacement |     1 | yes      | "Other" |
| major        | v1_replacement     |     2 |          |         |
| minor        | v2_replacement     |     3 |          |         |
| patch        | v3_replacement     |     4 |          |         |
| patch_minor  | v4_replacement     |     5 |          |         |

**Example:**

For the User-Agent: `Mozilla/5.0 (Windows; Windows NT 5.1; rv:2.0b3pre) Gecko/20100727 Minefield/4.0.1pre`
the matching `regex`:

```yaml
  - regex: '(Namoroka|Shiretoko|Minefield)/(\d+)\.(\d+)\.(\d+(?:pre)?)'
    family_replacement: 'Firefox ($1)'
```

captured groups:

1. `Minefield`
2. `4`
3. `0`
4. `1pre`

resolves to:

```
family: Firefox (Minefield)
major : 4
minor : 0
patch : 1pre
```

### OS

| field      | replacement       | group | required | failure |
|------------|-------------------|-------|----------|---------|
| family     | os_replacement    |     1 | yes      | "Other" |
| major      | os_v1_replacement |     2 |          |         |
| minor      | os_v2_replacement |     3 |          |         |
| patch      | os_v3_replacement |     4 |          |         |
| patchMinor | os_v4_replacement |     5 |          |         |

**Example:**

For the User-Agent: `Mozilla/5.0 (Windows; U; Win95; en-US; rv:1.1) Gecko/20020826`
the matching `regex`:

```yaml
  - regex: 'Win(95|98|3.1|NT|ME|2000)'
    os_replacement: 'Windows $1'
```

captured groups:

1. `95`

resolves to:

```
  os: Windows 95
```

### Device

| field  | replacement        | group | required | failure |
|--------|--------------------|-------|----------|---------|
| family | device_replacement |     1 | yes      | "Other" |
| brand  | brand_replacement  |       |          |         |
| model  | model_replacement  |     1 |          |         |

Device parsers have an additional metadata field `regex_flag`.

If this field is set to the value `i` (a string with a single
character U+0069 "LATIN SMALL LETTER I"), then `regex` is matched
case-insensitively rather than the default.

**Example:**

For the User-Agent: `Mozilla/5.0 (Linux; U; Android 4.2.2; de-de; PEDI_PLUS_W Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30`
the matching `regex`:

```yaml
  - regex: '; *(PEDI)_(PLUS)_(W) Build'
    device_replacement: 'Odys $1 $2 $3'
    brand_replacement: 'Odys'
    model_replacement: '$1 $2 $3'
```
captured groups:

1. `PEDI`
2. `PLUS`
3. `W`

resolves to:
```
  family: 'Odys PEDI PLUS W'
  brand: 'Odys'
  model: 'PEDI PLUS W'
```

## Parser Output

This section is non-normative.

For better portability and user experience across ua-parser
implementations, it is recommended to use somewhat standardised
output.

The following is the recommendation, defined in
[WebIDL](http://www.w3.org/TR/WebIDL/):

```idl
dictionary UaParserOutput {
    required string string;
    required UserAgent ua;
    required OS os;
    required Device device;
};

dictionary UserAgent {
    required string family;
    string major;
    string minor;
    string patch;
};

dictionary OS {
    required string family;
    string major;
    string minor;
    string patch;
    string patchMinor;
};

dictionary Device {
    required string family;
    string brand;
    string model;
};
```

## Changelog

### 0.3

- Reified concept of *template* remplacement fields (applies to all of
  them).
- All replacement fields converted to "full" templates.

  This unifies implementations and parsers as the current behaviour is
  inconsistent on both axis.

  - The test suite contains cases where the `$1` template value is
    used in other fields than `OS#os_replacement` (despite spec):

    ```yaml
    - regex: 'Mac OS X\s.{1,50}\s(\d+).(\d+).(\d+)'
      os_replacement: 'Mac OS X'
      os_v1_replacement: '$1'
      os_v2_replacement: '$2'
      os_v3_replacement: '$3'
    - regex: 'Win(?:dows)? ?(95|98|3.1|NT|ME|2000|XP|Vista|7|CE)'
      os_replacement: 'Windows'
      os_v1_replacement: '$1'
    - regex: '^Box.{0,200}Windows/([\d.]+);'
      os_replacement: 'Windows'
      os_v1_replacement: '$1'
    ```

  - The reference implementation's OS fields were all made into full
    templates in ua-parser/uap-ref-impl#11.
  - The Python implementation followed suite in ua-parser/uap-python#74.
  - The C# implementation uses a bunch of special cases.

  The biggest change is that UA fields are now full templates, whereas
  implementations generally only support restricted templating of
  `UserAgent#family`, despite spec of all replacement fields being
  restricted templates.
- the `Device#model_replacement` field is not required ("Opera/9.80
  (BlackBerry; Opera Mini/7.0.31437/28.3030; U; en) Presto/2.8.119
  Version/11.10"), default implementation has no fallback for model
