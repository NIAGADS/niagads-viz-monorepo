export const getViewTrackIdentifier = (trackView: any) => {
    const track = trackView.track;
    return "id" in track ? track.id : track.config.id;
};
