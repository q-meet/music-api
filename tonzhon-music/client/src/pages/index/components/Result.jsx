import React, { Component } from 'react';
import { Row, Col, Pagination } from 'antd';
import { connect } from 'react-redux';

import SongList from './SongList';
import Wrapper from './Wrapper';
import OperatingBarOfSongList from './OperatingBarOfSongList';
import to2D from '../lib/change_1d_to_2d';

// 一个Result就是一个有边框的面板
class Result extends Component {
  constructor(props) {
    super(props);
  }

  renderSongs = (songs) => {
    return (
      <SongList songs={songs} />
    );
  }

  renderAlbums = (albums) => {
    let albumsIn2D = to2D(albums, 4);
    return albumsIn2D.map((albumRow, rowIndex) => (
      <Row type="flex" justify="space-around" key={rowIndex}>
        {
          albumRow.map((album) => (
            <Col key={album.link}>
              <a href={album.link} title={album.name} target="_blank">
                <img src={album.picUrl} alt={album.name} style={{ display: 'inline-block', width: 180, height: 180, border: '1px solid #999'}}/>
              </a>
              <div className="nowrap" style={{ marginTop: 8, width: 182, fontSize: 'large' }}>
                <a href={album.link} title={album.name} target="_blank">{album.name}</a>
              </div>
              <div className="nowrap" style={{width: 182}}>
                {
                  album.artists.map((artist, artistIndex) => (
                    <span key={artist.link}>
                      { artistIndex > 0 && <span> / </span>}
                      <a href={artist.link} title={artist.name} target="_blank">{artist.name}</a>
                    </span>
                  ))
                }
              </div>
            </Col>
          ))
        }
      </Row>
    ));
  }

  renderArtists = (artists) => {
    const artistsIn2D = to2D(artists, 4);
    return artistsIn2D.map((artistRow, i) => (
      <Row type="flex" justify="space-around" key={i}>
        {
          artistRow.map((artist, i) => (
            <Col key={i}>
              <a href={artist.link} title={artist.name} target="_blank">
                <img src={artist.picUrl} alt={artist.name} style={{display: 'inline-block', width: 180, height: 180, borderRadius: 90, border: '1px solid #999'}}/>
              </a>
              <div className="nowrap" style={{ marginTop: 8, width: 182, fontSize: 'large', textAlign: 'center' }}>
                <a href={artist.link} title={artist.name} target="_blank">{artist.name}</a>
              </div>
            </Col>
          ))
        }
      </Row>
    ));
  }

  onPageChange = (page) => {
    const { provider, keyword, type, onResultResponded } = this.props;
    fetch(`/api/search?provider=${provider}&keyword=${keyword}&type=${type}&page=${page}`)
      .then(res => res.json())
      .then(json => {
        onResultResponded(provider, json);
      })
      .catch(err => {
        console.log('err ', err);
      });
  }

  render() {
    const { result, searchType, provider } = this.props;
    let mainPart;
    if (result.searchSuccess) {
      if (searchType === 'song') {
        mainPart = this.renderSongs(result.data.songs);
      } else if (searchType === 'album') {
        mainPart = this.renderAlbums(result.data.albums);
      } else if (searchType === 'artist') {
        mainPart = this.renderArtists(result.data.artists);
      }
    } else {
      mainPart = <h3>{result.message}</h3>;
    }

    return (
      <Wrapper provider={provider}
        operatingBar={
          result.searchSuccess && searchType === 'song' &&
          <OperatingBarOfSongList songs={result.data.songs} />
        }
        pagination={ result.searchSuccess &&
          <Pagination
             simple
             onChange={this.onPageChange}
             defaultPageSize={4}
             total={result.data.totalCount} />
        }
      >
        {mainPart}
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    keyword: state.searchParameters.keyword,
    type: state.searchParameters.type
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onResultResponded: (provider, data) => {
      dispatch({ type: 'UPDATE_SEARCH_RESULTS', provider, data});
    }
  };
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(Result);
