/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/dashboard` | `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/explore` | `/explore`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/mannequin` | `/mannequin`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/plan` | `/plan`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/upload` | `/upload`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/wardrobe` | `/wardrobe`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/dashboard` | `/dashboard`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/explore` | `/explore`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/mannequin` | `/mannequin`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/plan` | `/plan`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/upload` | `/upload`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/wardrobe` | `/wardrobe`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/dashboard${`?${string}` | `#${string}` | ''}` | `/dashboard${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/explore${`?${string}` | `#${string}` | ''}` | `/explore${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/mannequin${`?${string}` | `#${string}` | ''}` | `/mannequin${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/plan${`?${string}` | `#${string}` | ''}` | `/plan${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/upload${`?${string}` | `#${string}` | ''}` | `/upload${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/wardrobe${`?${string}` | `#${string}` | ''}` | `/wardrobe${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/dashboard` | `/dashboard`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/explore` | `/explore`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/mannequin` | `/mannequin`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/plan` | `/plan`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/upload` | `/upload`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/wardrobe` | `/wardrobe`; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}
