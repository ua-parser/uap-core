uap-core [![Build Status](https://secure.travis-ci.org/ua-parser/uap-core.svg?branch=master)](https://travis-ci.org/ua-parser/uap-core) [![Backers on Open Collective](https://opencollective.com/ua-parser/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/ua-parser/sponsors/badge.svg)](#sponsors) 
========

This repository contains the core of [BrowserScope][2]'s original [user agent string parser][3]: data collected over the years by [Steve Souders][4] and numerous other contributors, extracted into a separate [YAML file][5] so as to be reusable _as is_ by implementations in any programming language.

This repo itself does _not_ contain a parser: only the necessary data to build one. There exists a ref implementation, along with multiple, production-ready implementations in various programming languages.

Maintainers
-----------

* [Com Menthol](https://github.com/commenthol)
* [Lindsey Simon](https://github.com/elsigh) ([@elsigh](https://twitter.com/elsigh))
* [Tobie Langel](https://github.com/tobie) ([@tobie](https://twitter.com/tobie))

Communication channels
-----------------------

* \#ua-parser on freenode <irc://chat.freenode.net#ua-parser>
* [mailing list](https://groups.google.com/forum/#!forum/ua-parser)

Contributing Changes to regexes.yaml
------------------------------------

Please read the [contributors' guide](CONTRIBUTING.md)

## Credits
### Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<img src="https://opencollective.com/ua-parser/contributors.svg?width=890&button=false" />


### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/ua-parser#backer)]

<a href="https://opencollective.com/ua-parser#backers" target="_blank"><img src="https://opencollective.com/ua-parser/backers.svg?width=890"></a>


### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/ua-parser#sponsor)]

<a href="https://opencollective.com/ua-parser/sponsor/0/website" target="_blank"><img src="https://opencollective.com/ua-parser/sponsor/0/avatar.svg"></a>



License
-------

The data contained in `regexes.yaml` is Copyright 2009 Google Inc. and available under the [Apache License, Version 2.0][6].

[2]: http://www.browserscope.org
[3]: http://code.google.com/p/ua-parser/
[4]: http://stevesouders.com/
[5]: https://raw.github.com/ua-parser/uap-core/master/regexes.yaml
[6]: http://www.apache.org/licenses/LICENSE-2.0
