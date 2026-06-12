import { Component, resource, signal } from '@angular/core';
import { ANGULAR_MATERIAL_MODULES } from '../../shared/angular-material';
import { artistGenres, SignalsConstants } from '../signals-learning.constants';
import { ArtistItem } from '../signals-learning.models';

@Component({
  selector: 'app-resource-signal',
  standalone: true,
  imports: [...ANGULAR_MATERIAL_MODULES],
  templateUrl: './resource-signal.component.html',
  styleUrl: './resource-signal.component.scss'
})
export class ResourceSignalComponent {

  readonly genreList      = signal<string[]>(artistGenres);
  selectedArtistGenre     = signal<string>('All');

  /**
   * resource() — Angular 19's built-in async data loading primitive.
   *
   * request: () => the reactive "input" — whenever this changes, loader re-runs
   * loader : async function with access to { request, abortSignal }
   *
   * Built-in signals exposed automatically:
   *   .value()     — loaded data (undefined while loading)
   *   .isLoading() — true while fetching
   *   .error()     — error if loader threw
   *   .reload()    — manually trigger a re-fetch (same request)
   *
   * AbortSignal: passed to fetch() so Angular can cancel in-flight requests
   * automatically when the component is destroyed or the request changes.
   */
  artistResource = resource({
    request: () => this.selectedArtistGenre(),
    loader: async ({ request: genre, abortSignal }) => {
      await new Promise<void>(resolve => setTimeout(resolve, 700));
      const response = await fetch(SignalsConstants.artistDataURL, { signal: abortSignal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: ArtistItem[] = await response.json();
      return genre === 'All' ? data : data.filter(a => a.genre === genre);
    }
  });
}
