#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#else
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#endif

#if __has_include(<GoogleMobileAds/GADMobileAds.h>)

#import <GoogleMobileAds/GADRewardBasedVideoAdDelegate.h>

@interface RNAdMobRewarded : RCTEventEmitter <RCTBridgeModule, GADRewardBasedVideoAdDelegate>
@end

#else

@interface RNAdMobRewarded : RCTEventEmitter <RCTBridgeModule> {
}
@end

#endif
