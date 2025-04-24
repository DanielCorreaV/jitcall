package com.jitcall.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.jitcall.plugins.jitsiplugin.JitsiPluginPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(JitsiPluginPlugin.class);
  }
}
