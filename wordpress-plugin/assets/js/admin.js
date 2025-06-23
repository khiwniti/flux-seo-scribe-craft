/**
 * Flux SEO Admin JavaScript
 */
(function($) {
    'use strict';
    
    // Initialize when document is ready
    $(document).ready(function() {
        console.log('Flux SEO Admin JS initialized');
        
        // Content analyzer functionality
        $('.flux-seo-dashboard .button-primary').on('click', function() {
            const $button = $(this);
            const $card = $button.closest('.flux-seo-card');
            const $textarea = $card.find('textarea');
            
            if ($textarea.length && $textarea.val().trim() !== '') {
                // Show loading state
                $button.prop('disabled', true).text('Processing...');
                
                // Simulate analysis (would be an AJAX call to the server in production)
                setTimeout(function() {
                    // Create results container if it doesn't exist
                    if (!$card.find('.flux-seo-results').length) {
                        $card.append('<div class="flux-seo-results"></div>');
                    }
                    
                    // Add sample results
                    $card.find('.flux-seo-results').html(`
                        <h3>Analysis Results</h3>
                        <div class="flux-seo-result-item">
                            <strong>SEO Score:</strong> 78/100
                        </div>
                        <div class="flux-seo-result-item">
                            <strong>Readability:</strong> Good
                        </div>
                        <div class="flux-seo-result-item">
                            <strong>Word Count:</strong> ${$textarea.val().split(/\s+/).length}
                        </div>
                        <div class="flux-seo-result-item">
                            <strong>Suggestions:</strong>
                            <ul>
                                <li>Add more keywords to improve SEO</li>
                                <li>Consider adding more headings for better structure</li>
                                <li>Improve meta description length</li>
                            </ul>
                        </div>
                    `);
                    
                    // Reset button state
                    $button.prop('disabled', false).text('Analyze Content');
                }, 1500);
            }
        });
        
        // Settings page functionality
        $('#flux_seo_api_key').on('change', function() {
            const apiKey = $(this).val().trim();
            
            if (apiKey.length > 0) {
                // Validate API key format (simple check)
                if (apiKey.length < 10) {
                    $(this).after('<p class="flux-seo-error">API key seems too short. Please check.</p>');
                } else {
                    $('.flux-seo-error').remove();
                }
            }
        });
    });
    
})(jQuery);