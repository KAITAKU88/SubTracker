const { withAppBuildGradle } = require('@expo/config-plugins');

// Makes release builds use android/app/release.keystore (provisioned in CI
// from the ANDROID_KEYSTORE_BASE64 secret) when present, falling back to the
// debug keystore otherwise. Runs on every `expo prebuild` since prebuild
// regenerates app/build.gradle from scratch each time.
function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes('release.keystore')) {
      contents = contents.replace(
        /signingConfigs \{\n(\s*)debug \{([\s\S]*?)\n(\s*)\}\n(\s*)\}/,
        (match, indent1, debugBody, indent2, indent3) =>
          `signingConfigs {\n${indent1}debug {${debugBody}\n${indent2}}\n` +
          `${indent1}release {\n` +
          `${indent1}    def releaseKeystoreFile = file('release.keystore')\n` +
          `${indent1}    if (releaseKeystoreFile.exists()) {\n` +
          `${indent1}        storeFile releaseKeystoreFile\n` +
          `${indent1}        storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')\n` +
          `${indent1}        keyAlias System.getenv('ANDROID_KEY_ALIAS')\n` +
          `${indent1}        keyPassword System.getenv('ANDROID_KEY_PASSWORD')\n` +
          `${indent1}    }\n` +
          `${indent1}}\n${indent3}}`
      );

      contents = contents.replace(
        /signingConfig signingConfigs\.debug(\n\s*def enableShrinkResources)/,
        `signingConfig file("release.keystore").exists() ? signingConfigs.release : signingConfigs.debug$1`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withReleaseSigning;
