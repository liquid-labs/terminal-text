ifneq (grouped-target, $(findstring grouped-target,$(.FEATURES)))
ERROR:=$(error This version of make does not support required 'grouped-target' (4.3+).)
endif
.DELETE_ON_ERROR:

default: build

all: build

NPM_BIN:=npm exec
CATALYST_SCRIPTS:=$(NPM_BIN) catalyst-scripts

SRC:=src
BIN:=bin
TEST_STAGING:=test-staging
DIST:=dist

LIB:=$(DIST)/terminal-text.js
CLI:=$(BIN)/terminal-text.js

LIB_SRC:=$(SRC)/lib
LIB_SRC_FILES:=$(shell find $(LIB_SRC) -name "*.js" -o -name "*.mjs" -not -name "*.test.*")

CLI_SRC:=$(SRC)/cli
CLI_SRC_FILES:=$(shell find $(CLI_SRC) -name "*.js" -o -name "*.mjs" -not -name "*.test.*")

ALL_SRC_FILES:=$(shell find $(SRC) -name "*.js" -o -name "*.mjs")
TEST_BUILT_FILES=$(patsubst %.mjs, %.js, $(patsubst $(SRC)/%, test-staging/%, $(ALL_SRC_FILES)))

BUILD_FILES:=$(LIB) $(CLI)

# build rules
build: $(BUILD_FILES)

$(LIB): $(LIB_SRC_FILES)
	JS_SRC=$(LIB_SRC) $(CATALYST_SCRIPTS) build

$(CLI): $(CLI_SRC_FILES)
	JS_SRC=$(CLI_SRC) $(CATALYST_SCRIPTS) build

# test rules
$(TEST_BUILT_FILES) &: $(ALL_SRC_FILES)
	JS_SRC=$(SRC) $(CATALYST_SCRIPTS) pretest

last-test.txt: $(TEST_BUILT_FILES)
	( set -e; set -o pipefail; \
		JS_SRC=$(TEST_STAGING) $(CATALYST_SCRIPTS) test 2>&1 | tee last-test.txt; )

test: last-test.txt

# lint rules
last-lint.txt: $(ALL_SRC_FILES)
	( set -e; set -o pipefail; \
		JS_LINT_TARGET=$(SRC) $(CATALYST_SCRIPTS) lint | tee last-lint.txt; )

lint: last-lint.txt

lint-fix:
	JS_LINT_TARGET=$(SRC) $(CATALYST_SCRIPTS) lint-fix

# qa
qa: test lint
