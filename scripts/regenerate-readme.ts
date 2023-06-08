import { Auto, IPlugin, execPromise } from '@auto-it/core';

export default class RegenerateReadmePlugin implements IPlugin {
  name = 'regenerate-readme';

  apply(auto: Auto): void {
    auto.hooks.afterVersion.tapPromise(this.name, async () => {

    });
  }
}
