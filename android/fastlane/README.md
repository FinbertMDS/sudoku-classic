fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android bump_version_name

```sh
[bundle exec] fastlane android bump_version_name
```



### android internal

```sh
[bundle exec] fastlane android internal
```

Submit a new internal

### android increment_vn

```sh
[bundle exec] fastlane android increment_vn
```

Increment version name

### android increment_vn_force

```sh
[bundle exec] fastlane android increment_vn_force
```

Increment version name force

### android increment_vc

```sh
[bundle exec] fastlane android increment_vc
```

Increment version code

### android internal_github

```sh
[bundle exec] fastlane android internal_github
```

Submit a new internal by Github Actions

### android alpha

```sh
[bundle exec] fastlane android alpha
```

Submit a new alpha

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
