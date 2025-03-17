/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/map`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/FavoritesMenu` | `/FavoritesMenu`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/SearchMenu` | `/SearchMenu`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/map`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/FavoritesMenu` | `/FavoritesMenu`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/SearchMenu` | `/SearchMenu`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/map${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/FavoritesMenu${`?${string}` | `#${string}` | ''}` | `/FavoritesMenu${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/SearchMenu${`?${string}` | `#${string}` | ''}` | `/SearchMenu${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/map`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/FavoritesMenu` | `/FavoritesMenu`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/SearchMenu` | `/SearchMenu`; params?: Router.UnknownInputParams; };
    }
  }
}
