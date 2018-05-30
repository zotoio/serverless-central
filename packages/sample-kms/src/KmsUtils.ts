import * as AWS from 'aws-sdk';
import * as bunyan from 'bunyan';
const log = bunyan.createLogger({ name: 'KmsUtils' });

export class KmsUtils {
    private region = process.env.SLS_AWS_REGION;
    private kms: AWS.KMS;
    private store: Map<string, string> = new Map<string, string>();

    constructor() {
        this.kms = new AWS.KMS({ region: this.region });
        log.info('KmsUtils created');

        // populate once on cold start if instantiated outside handler
        this.primeStore();
    }

    public async decrypt(encrypted: any) {
        let result: string = '';
        if (encrypted) {
            log.info(`decrypting: ${encrypted}`);
            if (this.hasDecrypted(encrypted)) {
                log.info('returning stored decrypted value');
                return this.getDecrypted(encrypted);
            }
            try {
                const data = await this.kms
                    .decrypt({
                        CiphertextBlob: new Buffer(encrypted, 'base64')
                    })
                    .promise();
                result = String(data.Plaintext);
                log.info(`storing decrypted result.`);
                this.setDecrypted(encrypted, result);
            } catch (e) {
                log.error(e);
            }
        }
        return result;
    }
    private primeStore() {
        log.info(`priming decrypted var store`);
        Object.keys(process.env).forEach(async key => {
            if (key.startsWith('SLS_CRYPT_')) {
                await this.decrypt(process.env[key]);
                log.info(`stored ${key}`);
            }
        });
    }
    private hasDecrypted(encrypted: string) {
        return this.store.has(encrypted);
    }
    private getDecrypted(encrypted: string) {
        return this.store.get(encrypted);
    }
    private setDecrypted(encrypted: string, decrypted: string) {
        this.store.set(encrypted, decrypted);
    }
}
