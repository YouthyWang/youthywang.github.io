#!/usr/bin/env ruby
# Publication YAML source validation using only Ruby standard libraries.
require 'yaml'
require 'pathname'

root = Pathname.new(__dir__).parent.realpath
filename = root.join('_data', 'publications.yml')
errors = []
begin
  data = YAML.safe_load(filename.read, permitted_classes: [], aliases: false)
  unless data.is_a?(Hash) && data['items'].is_a?(Array)
    abort "Invalid publications.yml: expected 'items:' containing a list, or 'items: []'."
  end
  data['items'].each_with_index do |pub, i|
    marker = "Publication ##{i + 1}"
    unless pub.is_a?(Hash)
      errors << "#{marker}: each item must be a YAML mapping"
      next
    end
    %w[title authors].each do |key|
      val = pub[key]
      errors << "#{marker}: missing #{key}" unless val.is_a?(String) && !val.strip.empty?
    end
    if pub.key?('links')
      if !pub['links'].is_a?(Array)
        errors << "#{marker}: links must be a list"
      else
        pub['links'].each_with_index do |link, j|
          lmark = "#{marker} link ##{j + 1}"
          if !link.is_a?(Hash)
            errors << "#{lmark}: expected label and url fields"
            next
          end
          url = link['url']
          errors << "#{lmark}: missing label" unless link['label'].is_a?(String) && !link['label'].strip.empty?
          if !url.is_a?(String) || url.strip.empty?
            errors << "#{lmark}: missing URL"
          elsif url.start_with?('/')
            resolved = root.join(url.delete_prefix('/')).cleanpath
            errors << "#{lmark}: URL escapes project directory" unless resolved.to_s.start_with?(root.to_s + File::SEPARATOR)
            errors << "#{lmark}: local file does not exist: #{url}" unless resolved.file?
          elsif !url.match?(%r{\Ahttps?://[^\s]+\z})
            errors << "#{lmark}: must be a full http(s) URL or absolute site path /files/..."
          end
        end
      end
    end
  end
  if errors.empty?
    puts "Publications OK (#{data['items'].length} item(s)); same records on EN / 中 About."
  else
    warn errors.join("\n")
    exit 1
  end
rescue Psych::SyntaxError => e
  abort "Invalid YAML in publications.yml: #{e.message}"
end
