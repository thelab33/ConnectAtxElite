function switchTier(tier) {
  document.querySelectorAll('link[data-tier]').forEach(link => {
    link.disabled = link.dataset.tier !== tier;
  });
}
// Default to basic
switchTier('basic');
