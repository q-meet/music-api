import React, { Component } from 'react';
import { Row, Col, Icon, List } from 'antd';

import neteaseMusicLogo from './images/netease_16.ico';
import qqMusicLogo from './images/qq_16.ico';
import xiamiMusicLogo from './images/xiami_16.ico';
import { connect } from 'react-redux';
import './in_playing_list.css';

class SongItem extends Component {
  constructor(props) {
    super(props);
  }

  changeCurrentSong = () => {
    const index = this.props.playingList.findIndex(song =>
      song.link === this.props.song.link);
    if (index === -1) {
      this.props.addToPlayingList(this.props.song);
      this.props.updatePlayIndex(this.props.playingList.length);
    } else {
      this.props.updatePlayIndex(index);
    }
  }

  deleteFromPlaylist = () => {
    const index = this.props.playingList.findIndex(song =>
                  song.link === this.props.song.link);
    if (index + 1 === this.props.playingList.length) {
      this.props.updatePlayIndex(0);
    }
    this.props.deleteSongInPlayingList(index, this.props.playIndex);
  }

  render() {
    let { song, currentSong } = this.props;
    return (
      <List.Item onClick={this.changeCurrentSong}
        className={currentSong && currentSong.link === song.link ?
          'list-item playing' : 'list-item'
        }
        style={{ border: 'none', padding: '6px 0' }}
      >
        <Row type="flex" align="middle"
          style={{ width: '100%', color: 'white', padding: '0 20px' }}
        >
          <Col span={10} className="nowrap">
            {song.name}
          </Col>
          <Col span={10} className="nowrap">
            {
              song.artists.map(artist => artist.name)
                .reduce((accumulator, currentValue) =>
                  accumulator + ' / ' + currentValue
                )
            }
          </Col>
          <Col span={2}>
            <img src={logos[song.platform]} alt={song.platform} />
          </Col>
          <Col span={2}>
            <a onClick={this.deleteFromPlaylist} className="delete-btn">
              <Icon type="delete" style={{
                fontSize: 18,
                verticalAlign: 'middle'
              }} />
            </a>
          </Col>
        </Row>
      </List.Item>
    );
  }
}

const logos = {
  qq: qqMusicLogo,
  netease: neteaseMusicLogo,
  xiami: xiamiMusicLogo
};

function mapStateToProps(state) {
  return {
    currentSong: state.playingList[state.playIndex],
    playingList: state.playingList,
    playIndex: state.playIndex,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addToPlaylist: (song) => {
      dispatch({ type: 'ADD_TO_PLAYING_LIST', data: song });
    },
    updatePlayIndex: (index) => {
      dispatch({ type: 'UPDATE_PLAY_INDEX', data: index });
    },
    deleteSongInPlayingList: (indexToDelete, playIndex) => {
      dispatch({ type: 'DELETE_SONG_IN_PLAYING_LIST', data: indexToDelete });
      if (indexToDelete < playIndex) {
        dispatch({ type: 'UPDATE_PLAY_INDEX', data: playIndex - 1 });
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongItem);
