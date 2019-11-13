import React, { Component } from "react";

export class AlbumCover extends Component {
    render() {
        const track = this.props.track // A changer ;)
        const src = track.album.images[1].url
        return (<img src={src} style={{ width: 400, height: 400 }} />);
    }
}
