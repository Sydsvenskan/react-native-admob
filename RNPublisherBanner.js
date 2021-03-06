import React, { Component } from 'react';
import {
  NativeModules,
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewPropTypes,
} from 'react-native';
import { string, func, arrayOf, bool, object, shape, instanceOf, oneOf, number } from 'prop-types';

import { createErrorFromErrorData } from './utils';

class PublisherBanner extends Component {

  constructor() {
    super();
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAdmobDispatchAppEvent = this.handleAdmobDispatchAppEvent.bind(this);
    this.handleDidFailToReceiveAdWithError = this.handleDidFailToReceiveAdWithError.bind(this);
    this.state = {
      style: {},
    };
  }

  componentDidMount() {
    this.loadBanner();
  }

  loadBanner() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._bannerView),
      UIManager.RNDFPBannerView.Commands.loadBanner,
      null,
    );
  }

  handleSizeChange(event) {
    const { height, width } = event.nativeEvent;
    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange({ width, height });
    }
  }

  handleAdmobDispatchAppEvent(event) {
    if (this.props.onAdmobDispatchAppEvent) {
      const { name, info } = event.nativeEvent;
      this.props.onAdmobDispatchAppEvent({ name, info });
    }
  }

  handleDidFailToReceiveAdWithError(event) {
    if (this.props.onDidFailToReceiveAdWithError) {
      this.props.onDidFailToReceiveAdWithError(createErrorFromErrorData(event.nativeEvent.error));
    }
  }

  render() {
    return (
      <RNDFPBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onSizeChange={this.handleSizeChange}
        onDidFailToReceiveAdWithError={this.handleDidFailToReceiveAdWithError}
        onAdmobDispatchAppEvent={this.handleAdmobDispatchAppEvent}
        onAdViewDidReceiveAd={this.props.adViewDidReceiveAd}
        onAdViewWillPresentScreen={this.props.adViewWillPresentScreen}
        onAdViewWillDismissScreen={this.props.adViewWillDismissScreen}
        onAdViewDidDismissScreen={this.props.adViewDidDismissScreen}
        onAdViewWillLeaveApplication={this.props.adViewWillLeaveApplication}
        ref={el => (this._bannerView = el)}
      />
    );
  }
}

Object.defineProperty(PublisherBanner, 'simulatorId', {
  get() {
    return NativeModules.RNDFPBannerViewManager.simulatorId;
  },
});

PublisherBanner.propTypes = {
  ...ViewPropTypes,

  /**
   * AdMob iOS library banner size constants
   * Example: {width: 320, height: 320}
   */
  adSize: object,

  /**
   * Optional array specifying all valid sizes that are appropriate for this slot.
   * Example: [{width: 320, height: 320}, {width: 300, height: 250}]
   */
  validAdSizes: arrayOf(object),

  /**
   * AdMob ad unit ID
   */
  adUnitID: string,

  /**
   * Array of test devices. Use PublisherBanner.simulatorId for the simulator
   */
  testDevices: arrayOf(string),

  /**
   * AdMob iOS library events
   */
  onSizeChange: func,
  onAdViewDidReceiveAd: func,
  onDidFailToReceiveAdWithError: func,
  onAdViewWillPresentScreen: func,
  onAdViewWillDismissScreen: func,
  onAdViewDidDismissScreen: func,
  onAdViewWillLeaveApplication: func,
  onAdmobDispatchAppEvent: func,

  targeting: shape({
    /**
     * Arbitrary object of custom targeting information.
     */
    customTargeting: object,

    /**
     * Array of exclusion labels.
     */
    categoryExclusions: arrayOf(string),

    /**
     * Array of keyword strings.
     */
    keywords: arrayOf(string),

    /**
     * When using backfill or an SDK mediation creative, gender can be supplied
     * in the ad request for targeting purposes.
     */
    gender: oneOf(['unknown', 'male', 'female']),

    /**
     * When using backfill or an SDK mediation creative, birthday can be supplied
     * in the ad request for targeting purposes.
     */
    birthday: instanceOf(Date),

    /**
     * Indicate that you want Google to treat your content as child-directed.
     */
    childDirectedTreatment: bool,

    /**
     * Applications that monetize content matching a webpage's content may pass
     * a content URL for keyword targeting.
     */
    contentURL: string,

    /**
     * You can set a publisher provided identifier (PPID) for use in frequency
     * capping, audience segmentation and targeting, sequential ad rotation, and
     * other audience-based ad delivery controls across devices.
     */
    publisherProvidedID: string,

    /**
     * The user’s current location may be used to deliver more relevant ads.
     */
    location: shape({
      latitude: number,
      longitude: number,
      accuracy: number,
    }),
  }),
};

const RNDFPBannerView = requireNativeComponent('RNDFPBannerView', PublisherBanner);

export default PublisherBanner;
