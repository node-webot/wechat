TESTS = test/*.js
REPORTER = spec
TIMEOUT = 10000
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

test-cov: lib-cov
	@WEIXIN_COV=1 $(MAKE) test REPORTER=dot
	@WEIXIN_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -rf $@
	@$(JSCOVERAGE) lib $@

.PHONY: test test-cov lib-cov
