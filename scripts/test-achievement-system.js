// Test script to verify achievement popup system
// Run this in the browser console to test

async function testAchievementSystem() {
  console.log('🧪 Testing achievement popup system...');
  
  try {
    // Test sync-achievements API
    console.log('1. Testing sync-achievements API...');
    const syncResponse = await fetch('/api/user/sync-achievements', {
      method: 'POST'
    });
    
    if (syncResponse.ok) {
      const syncData = await syncResponse.json();
      console.log('✅ Sync API response:', syncData);
      
      if (syncData.newAchievementsForPopup && syncData.newAchievementsForPopup.length > 0) {
        console.log('🎉 New achievements found!', syncData.newAchievementsForPopup);
        
        // Try to trigger popup manually
        if (window.showAchievementPopup) {
          console.log('🎯 Triggering popup manually...');
          window.showAchievementPopup(syncData.newAchievementsForPopup[0]);
        } else {
          console.log('❌ showAchievementPopup not available in window');
        }
      } else {
        console.log('ℹ️ No new achievements found');
      }
    } else {
      console.log('❌ Sync API failed:', syncResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Add to window for easy access
window.testAchievementSystem = testAchievementSystem;

console.log('🎯 Achievement system test script loaded!');
console.log('Run testAchievementSystem() in the console to test.'); 