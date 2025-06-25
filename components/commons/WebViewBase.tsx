import React, {useEffect, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useTheme} from '../../context/ThemeContext';
import Header from './Header';

type WebViewBaseProps = {
  title: string;
  source: any;
  needPadding?: boolean;
};

export default function WebViewBase({
  title,
  source,
  needPadding = false,
}: WebViewBaseProps) {
  const {theme, mode} = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const darkModeStyle = `
      (function() {
        const style = document.createElement('style');
        style.innerHTML = \`
          body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
          }
          .license {
            background: #1e1e1e !important;
            box-shadow: 0 0 4px rgba(255,255,255,0.05) !important;
          }
          .note {
            color: #aaa !important;
          }
        \`;
        document.head.appendChild(style);
        window.ReactNativeWebView.postMessage("Dark mode style injected");
      })();
    `;

  const injectDarkModeToIframe = (iframe: HTMLIFrameElement) => {
    if (!iframe || !iframe.contentDocument) return;

    const style = iframe.contentDocument.createElement('style');
    style.innerHTML = `
        body {
          background-color: #121212 !important;
          color: #e0e0e0 !important;
        }
        .license {
          background: #1e1e1e !important;
          box-shadow: 0 0 4px rgba(255,255,255,0.05) !important;
        }
        .note {
          color: #aaa !important;
        }
      `;
    iframe.contentDocument.head.appendChild(style);
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const iframe = iframeRef.current;

    if (!iframe) return;

    const handleLoad = () => {
      if (mode === 'dark') {
        try {
          injectDarkModeToIframe(iframe);
        } catch (err) {
          console.warn('Could not inject dark mode into iframe:', err);
        }
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [mode]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}
    >
      <Header
        title={title}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />

      {Platform.OS === 'web' ? (
        <View style={{flex: 1}}>
          <iframe
            src={source}
            ref={iframeRef}
            style={{width: '100%', height: '100%', border: 'none'}}
          />
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={source}
          injectedJavaScript={mode === 'dark' ? darkModeStyle : ''}
          onMessage={(_) => {}}
          style={needPadding ? styles.content : {}}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 16,
  },
});
