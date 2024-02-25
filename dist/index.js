import { HTTP_PORT } from './config/index.js';
import { color } from './console-styling/consoleStyling.js';
import { httpServer } from './servers/httpServer.js';
httpServer.listen(HTTP_PORT, () => {
    console.log(color.magenta('⊙', 'Http server is running on'), `http://localhost:${HTTP_PORT}`);
    console.log(color.magenta('⊙', 'Websocket server is running on'), `ws://localhost:${HTTP_PORT}`);
});
//# sourceMappingURL=index.js.map