package com.jitcall.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.jitcall.plugins.jitsiplugin.JitsiPluginPlugin;
import com.capacitorcommunity.videorecorder.VideoRecorderPlugin;
import com.capacitorcommunity.videorecorder.R;
import android.view.View;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(JitsiPluginPlugin.class);
    registerPlugin(VideoRecorderPlugin.class);
    enableImmersiveMode();
  }

  private void enableImmersiveMode() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
      | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
      | View.SYSTEM_UI_FLAG_FULLSCREEN
    );
  }
}
