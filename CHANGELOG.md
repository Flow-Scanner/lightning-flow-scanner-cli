# Changelog

## beta

_can be used with `lightning-flow-scanner-core@beta`_

- Automate Releases via GitHub Actions
  - From `master` branch: **beta**
  - From `alpha` branch: **alpha**
  - When a GitHub release is created: Git tag selected for the release.
- Run tests during Pull Request checks

## [3.16.0] 2024-05-12

- Consistent Parsing Across Platforms: We've unified parsing modules across platforms, ensuring consistent parsing of flows. This enhancement improves compatibility and developer workflows.
- Improved Developer Experience: Say goodbye to xml2js! We've directly integrated xmlbuilder2 into the core module, enabling direct manipulation of Flow XML files. Utilize xmlbuilder2's convert function for seamless XML-to-JavaScript object transformation, simplifying parsing within the core module.
- Robust Error Handling: Experience smoother development processes with our robust error handling. We've implemented resilient mechanisms for graceful handling of parsing errors.