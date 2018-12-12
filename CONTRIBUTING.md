Contributing Changes to regexes.yaml
------------------------------------

Contributing to the project, especially `regexes.yaml`, is both welcomed and encouraged. To do so just do the following:

1. Fork the project
2. Create a branch for your changes
3. Modify `regexes.yaml` as appropriate
4. Add relevant tests to the following files and follow their format:
	* `tests/test_device.yaml`
	* `tests/test_os.yaml`
	* `tests/test_ua.yaml`
5. Check that your regex is not vulnerable to [ReDoS](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) using the test in `tests/regexes.js`
6. Push your branch to GitHub and submit a pull request
7. Monitor the pull request to make sure the Travis build succeeds. If it fails simply make the necessary changes to your branch and push it. Travis will re-test the changes.

That's it. If you don't feel comfortable forking the project or modifying the YAML you can also [submit an issue](https://github.com/ua-parser/uap-core/issues) that includes the appropriate user agent string and the expected results of parsing.

Thanks!
