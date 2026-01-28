// app.js - Application initialization and global event handlers

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('X-Wing Miniatures Game Helper loaded successfully!');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key closes detail panel
        if (e.key === 'Escape') {
            ui.closeDetail();
        }
        
        // Arrow keys for phase navigation (only when game is active)
        if (document.getElementById('gameScreen').style.display !== 'none') {
            if (e.key === 'ArrowRight') {
                game.nextPhase();
            } else if (e.key === 'ArrowLeft') {
                game.previousPhase();
            }
        }
    });

    // Add keyboard shortcut help
    console.log('Keyboard Shortcuts:');
    console.log('  Escape - Close detail panel');
    console.log('  Arrow Right - Next phase');
    console.log('  Arrow Left - Previous phase');
});

// Prevent clicks on overlay from propagating
document.addEventListener('click', function(e) {
    if (e.target.id === 'overlay') {
        ui.closeDetail();
    }
});

// Add smooth scroll behavior for detail panel
const detailPanel = document.getElementById('detailPanel');
if (detailPanel) {
    detailPanel.style.scrollBehavior = 'smooth';
}

// Export for debugging (optional)
window.xwingHelper = {
    game: game,
    ui: ui,
    data: gameData,
    version: '1.0.0'
};

console.log('X-Wing Helper v1.0.0 - Ready to play!');
