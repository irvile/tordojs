import { createRollupConfigs } from '../../scripts/rollup/config';

import packageJson from './package.json';

export default createRollupConfigs({ pkg: packageJson });
