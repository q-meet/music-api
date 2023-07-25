# tongzhong-music

[English](./README_en.md)

<img src="./screenshots/qr_code.png" width="64" alt="mobile">

<h3>将QQ音乐、网易云音乐和虾米音乐上的歌添加到一个列表来播放！</h3>

## 功能

### 桌面版

- 搜索
 (支持使用查询字符串搜索)
- 播放
- 下载
- 热歌榜（包括QQ音乐和网易云音乐）
- 记录搜索历史

<img src="./screenshots/0111.PNG" alt="desktop">

### 移动版

- 搜索
- 播放

<img src="./screenshots/m.PNG" alt="mobile">

## 使用

    # Install dependencies
    npm install
    # Build client-side bundle
    npm run build
    # Start the server
    npm run server
打开 `http://localhost:8081` 即可。

docker 命令

```shell
sudo docker build . -t tonzhon-music;
sudo docker run -d --name=tonzhon-music3 -p 8081:8081 tonzhon-music;
```

## 开发

### 后端

    # Start nodemon dev server (需要全局安装 nodemon)
    npm run dev-server



    # Start webpack dev server
    npm start
桌面版打开 `http://localhost:3000/`，移动版打开`http://localhost:3000/m/`。（注意是 `/m/`）

## 致谢

- [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
- [LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)

## License

MIT
