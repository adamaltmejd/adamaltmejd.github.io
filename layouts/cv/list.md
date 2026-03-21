---
{{ with .Params.cv -}}
title: Curriculum Vitae
author: {{ site.Params.author.name }}
email: '{{ site.Params.author.email }}'
homepage: {{ .homepage }}
mobile: '{{ .mobile }}'
address:
    affiliation: '{{ .address.affiliation }}'
    online: '{{ .address.online }}'
    street: '{{ .address.street }}'
    city: '{{ .address.city }}'
{{ end -}}
---
{{ $parts := split .RawContent "<!-- PUBLICATIONS -->" -}}
{{ index $parts 0 }}
{{- $research := where site.RegularPages "Section" "research" -}}
{{- $publications := where $research "Params.publication_type" "Publications" -}}
{{- $workingPapers := where $research "Params.publication_type" "Work in Progress" }}
# Publications
{{ $prevYear := 0 -}}
{{ range $publications.ByDate.Reverse -}}
{{ $page := . -}}
{{ $bib := index site.Data.publications .File.ContentBaseName -}}
{{ with $bib -}}
{{ $year := $page.Date.Year -}}
{{ if ne $year $prevYear }}
{{ $year }}
{{ $prevYear = $year -}}
{{ end -}}
:   {{ partial "format-citation.html" (dict "page" $page "md" true) }}
{{ end -}}
{{ end }}
# Working Papers
{{ $prevYear = 0 -}}
{{ range $workingPapers.ByDate.Reverse -}}
{{ $page := . -}}
{{ $bib := index site.Data.publications .File.ContentBaseName -}}
{{ with $bib -}}
{{ $year := $page.Date.Year -}}
{{ if ne $year $prevYear }}
{{ $year }}
{{ $prevYear = $year -}}
{{ end -}}
:   {{ partial "format-citation.html" (dict "page" $page "md" true) }}
{{ end -}}
{{ end }}
{{ strings.TrimLeft "\n" (index $parts 1) }}
