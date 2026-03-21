---
{{ with .Params.cv -}}
title: Curriculum Vitae
author: {{ site.Params.author.name }}
email: '{{ site.Params.author.email }}'
homepage: {{ .homepage }}
twitter: '{{ site.Params.author.twitter }}'
mobile: '{{ .mobile }}'
address:
    affiliation: '{{ .address.affiliation }}'
    online: '{{ .address.online }}'
    main: '{{ .address.main }}'
    city: '{{ .address.city }}'
{{ end -}}
---
{{ $parts := split .RawContent "<!-- PUBLICATIONS -->" -}}
{{ index $parts 0 }}
{{- $research := where site.RegularPages "Section" "research" -}}
{{- $publications := where $research "Params.publication_type" "Publications" -}}
{{- $workingPapers := where $research "Params.publication_type" "Work in Progress" -}}
{{- $workingPapers = where $workingPapers "Params.citation" "ne" nil }}
# Publications
{{ $prevYear := 0 -}}
{{ range $publications.ByDate.Reverse -}}
{{ $year := .Date.Year -}}
{{ if ne $year $prevYear }}
{{ $year }}
{{ $prevYear = $year -}}
{{ end -}}
:   {{ .Params.citation }}
{{ end }}
# Working Papers
{{ $prevYear = 0 -}}
{{ range $workingPapers.ByDate.Reverse -}}
{{ $year := .Date.Year -}}
{{ if ne $year $prevYear }}
{{ $year }}
{{ $prevYear = $year -}}
{{ end -}}
:   {{ .Params.citation }}
{{ end -}}

{{ strings.TrimLeft "\n" (index $parts 1) }}
