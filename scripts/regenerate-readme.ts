import { Auto, IPlugin, execPromise, getLernaPackages } from '@auto-it/core';

export default class RegenerateReadmePlugin implements IPlugin {
  name = 'regenerate-readme';

  apply(auto: Auto): void {
    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      const packages = await getLernaPackages();

      auto.logger.log.debug(packages)
    });
  }
}
