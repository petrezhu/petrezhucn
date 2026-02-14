{{ partial('_partials/header/brand.swig', {}, {cache: false}) }}

{{ partial('_partials/header/menu.swig', {}, {cache: false}) }}

{{ partial('_partials/search/index.swig', {}, {cache: theme.cache.enable}) }}

{{- next_inject('header') }}
