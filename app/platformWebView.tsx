import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

// Default URL for Depop sell page
const DEFAULT_URL = "https://www.depop.com/sell";

// JavaScript code to inject into the WebView
const INJECTED_SCRIPT = `
  // Function to fill form fields
  function fillFormFields(data) {
    try {
      // Example: Fill title field
      const titleField = document.querySelector('input[name="title"], input[placeholder*="title"], textarea[name="title"]');
      if (titleField && data.title) {
        titleField.value = data.title;
        titleField.dispatchEvent(new Event('input', { bubbles: true }));
        titleField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Example: Fill description field
      const descField = document.querySelector('textarea[name="description"], textarea[placeholder*="description"], textarea[name="details"]');
      if (descField && data.description) {
        descField.value = data.description;
        descField.dispatchEvent(new Event('input', { bubbles: true }));
        descField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Example: Fill price field
      const priceField = document.querySelector('input[name="price"], input[placeholder*="price"], input[type="number"]');
      if (priceField && data.price) {
        priceField.value = data.price;
        priceField.dispatchEvent(new Event('input', { bubbles: true }));
        priceField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Example: Fill category field
      const categoryField = document.querySelector('select[name="category"], input[name="category"], input[placeholder*="category"]');
      if (categoryField && data.category) {
        if (categoryField.tagName === 'SELECT') {
          // For dropdown/select elements
          const option = Array.from(categoryField.options).find(opt => 
            opt.text.toLowerCase().includes(data.category.toLowerCase())
          );
          if (option) {
            categoryField.value = option.value;
            categoryField.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else {
          // For input fields
          categoryField.value = data.category;
          categoryField.dispatchEvent(new Event('input', { bubbles: true }));
          categoryField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Example: Fill brand field
      const brandField = document.querySelector('input[name="brand"], input[placeholder*="brand"]');
      if (brandField && data.brand) {
        brandField.value = data.brand;
        brandField.dispatchEvent(new Event('input', { bubbles: true }));
        brandField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Example: Fill condition field
      const conditionField = document.querySelector('select[name="condition"], input[name="condition"]');
      if (conditionField && data.condition) {
        if (conditionField.tagName === 'SELECT') {
          const option = Array.from(conditionField.options).find(opt => 
            opt.text.toLowerCase().includes(data.condition.toLowerCase())
          );
          if (option) {
            conditionField.value = option.value;
            conditionField.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } else {
          conditionField.value = data.condition;
          conditionField.dispatchEvent(new Event('input', { bubbles: true }));
          conditionField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      // Send success message back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FORM_FILLED',
        success: true,
        message: 'Form fields filled successfully'
      }));

    } catch (error) {
      // Send error message back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FORM_FILLED',
        success: false,
        error: error.message
      }));
    }
  }

  // Function to upload images
  function uploadImages(imageData) {
    try {
      // Look for file input elements
      const fileInputs = document.querySelectorAll('input[type="file"], input[accept*="image"]');
      
      if (fileInputs.length > 0) {
        // Convert base64 to blob
        const base64ToBlob = (base64, mimeType) => {
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: mimeType });
        };

        // Create file objects from base64 data
        const files = imageData.map((img, index) => {
          const blob = base64ToBlob(img.data, img.mimeType || 'image/jpeg');
          return new File([blob], 'image' + (index + 1) + '.jpg', { type: img.mimeType || 'image/jpeg' });
        });

        // Attach files to file inputs
        fileInputs.forEach((input, index) => {
          if (files[index]) {
            // Create a new DataTransfer object
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[index]);
            input.files = dataTransfer.files;
            
            // Trigger change event
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'IMAGES_UPLOADED',
          success: true,
          message: 'Images uploaded successfully'
        }));
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'IMAGES_UPLOADED',
          success: false,
          error: 'No file input found'
        }));
      }
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'IMAGES_UPLOADED',
        success: false,
        error: error.message
      }));
    }
  }

  // Function to submit the form
  function submitForm() {
    try {
      // Look for submit button with various selectors
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:contains("Submit")',
        'button:contains("Post")',
        'button:contains("List")',
        'button:contains("Create")',
        'button:contains("Publish")',
        'button:contains("Save")',
        '[data-testid*="submit"]',
        '[data-testid*="post"]',
        '[data-testid*="list"]'
      ];
      
      let submitButton = null;
      for (const selector of submitSelectors) {
        submitButton = document.querySelector(selector);
        if (submitButton) break;
      }
      
      // If no button found with selectors, try to find by text content
      if (!submitButton) {
        const allButtons = document.querySelectorAll('button');
        for (const button of allButtons) {
          const text = button.textContent.toLowerCase();
          if (text.includes('submit') || text.includes('post') || text.includes('list') || 
              text.includes('create') || text.includes('publish') || text.includes('save')) {
            submitButton = button;
            break;
          }
        }
      }
      
      if (submitButton) {
        submitButton.click();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'FORM_SUBMITTED',
          success: true,
          message: 'Form submitted successfully'
        }));
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'FORM_SUBMITTED',
          success: false,
          error: 'Submit button not found'
        }));
      }
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FORM_SUBMITTED',
        success: false,
        error: error.message
      }));
    }
  }

  // Function to get form data
  function getFormData() {
    try {
      const formData = {};
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        if (input.name) {
          formData[input.name] = input.value;
        }
      });

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FORM_DATA',
        data: formData
      }));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'FORM_DATA',
        error: error.message
      }));
    }
  }

  // Function to wait for element to appear
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Element not found within timeout'));
      }, timeout);
    });
  }

  // Function to fill form with retry mechanism
  async function fillFormWithRetry(data, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        fillFormFields(data);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'FORM_FILLED',
          success: true,
          message: 'Form filled successfully on attempt ' + attempt
        }));
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'FORM_FILLED',
            success: false,
            error: 'Failed after ' + maxRetries + ' attempts: ' + error.message
          }));
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  // Function to detect platform and adjust selectors
  function detectPlatform() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    
    if (hostname.includes('depop.com')) {
      return 'depop';
    } else if (hostname.includes('ebay.com')) {
      return 'ebay';
    } else if (hostname.includes('facebook.com')) {
      return 'facebook';
    } else {
      return 'unknown';
    }
  }

  // Listen for messages from React Native
  window.addEventListener('message', function(event) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.action) {
        case 'FILL_FORM':
          fillFormFields(data.formData);
          break;
        case 'FILL_FORM_RETRY':
          fillFormWithRetry(data.formData, data.maxRetries || 3);
          break;
        case 'UPLOAD_IMAGES':
          uploadImages(data.images);
          break;
        case 'SUBMIT_FORM':
          submitForm();
          break;
        case 'GET_FORM_DATA':
          getFormData();
          break;
        case 'WAIT_FOR_ELEMENT':
          waitForElement(data.selector, data.timeout).then(element => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ELEMENT_FOUND',
              selector: data.selector,
              success: true
            }));
          }).catch(error => {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ELEMENT_FOUND',
              selector: data.selector,
              success: false,
              error: error.message
            }));
          });
          break;
        case 'DETECT_PLATFORM':
          const platform = detectPlatform();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PLATFORM_DETECTED',
            platform: platform
          }));
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Notify React Native that script is loaded
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'SCRIPT_LOADED',
    message: 'JavaScript injection complete'
  }));

  true; // Required for WebView
`;

const PlatformWebView = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const router = useRouter();

  // Get data passed from the sell page
  const params = useLocalSearchParams();
  const listingData = params.listingData
    ? JSON.parse(params.listingData as string)
    : null;
  const platform = (params.platform as string) || "depop";
  const customUrl = params.url as string;

  // Determine the URL to load based on platform
  const getWebViewUrl = () => {
    if (customUrl) return customUrl;

    switch (platform) {
      case "ebay":
        return "https://www.ebay.com/sh/lst/active";
      case "facebook":
        return "https://www.facebook.com/marketplace/create/item";
      case "depop":
      default:
        return DEFAULT_URL;
    }
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case "SCRIPT_LOADED":
          console.log("JavaScript injection complete");
          // Auto-fill form if we have listing data
          if (listingData) {
            setTimeout(() => {
              injectFormData(listingData);
            }, 2000); // Wait for page to fully load
          }
          break;

        case "FORM_FILLED":
          if (data.success) {
            Alert.alert("Success", "Form fields filled successfully");
          } else {
            Alert.alert("Error", `Failed to fill form: ${data.error}`);
          }
          break;

        case "IMAGES_UPLOADED":
          if (data.success) {
            Alert.alert("Success", "Images uploaded successfully");
          } else {
            Alert.alert("Error", `Failed to upload images: ${data.error}`);
          }
          break;

        case "FORM_SUBMITTED":
          if (data.success) {
            Alert.alert("Success", "Form submitted successfully");
          } else {
            Alert.alert("Error", `Failed to submit form: ${data.error}`);
          }
          break;

        case "FORM_DATA":
          if (data.data) {
            console.log("Current form data:", data.data);
          } else {
            console.error("Error getting form data:", data.error);
          }
          break;

        case "ELEMENT_FOUND":
          if (data.success) {
            console.log(`Element found: ${data.selector}`);
          } else {
            console.error(
              `Element not found: ${data.selector} - ${data.error}`
            );
          }
          break;

        case "PLATFORM_DETECTED":
          console.log(`Platform detected: ${data.platform}`);
          break;
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Function to inject form data
  const injectFormData = (data: any) => {
    const message = JSON.stringify({
      action: "FILL_FORM",
      formData: data,
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to upload images
  const uploadImages = (images: any[]) => {
    const message = JSON.stringify({
      action: "UPLOAD_IMAGES",
      images: images,
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to submit form
  const submitForm = () => {
    const message = JSON.stringify({
      action: "SUBMIT_FORM",
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to get current form data
  const getFormData = () => {
    const message = JSON.stringify({
      action: "GET_FORM_DATA",
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to fill form with retry mechanism
  const fillFormWithRetry = (data: any, maxRetries: number = 3) => {
    const message = JSON.stringify({
      action: "FILL_FORM_RETRY",
      formData: data,
      maxRetries,
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to wait for element to appear
  const waitForElement = (selector: string, timeout: number = 10000) => {
    const message = JSON.stringify({
      action: "WAIT_FOR_ELEMENT",
      selector,
      timeout,
    });
    webViewRef.current?.postMessage(message);
  };

  // Function to detect platform
  const detectPlatform = () => {
    const message = JSON.stringify({
      action: "DETECT_PLATFORM",
    });
    webViewRef.current?.postMessage(message);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header with navigation controls */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#f8f9fa",
          borderBottomWidth: 1,
          borderBottomColor: "#e9ecef",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8, marginRight: 10 }}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {platform}
        </Text>

        <TouchableOpacity
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}
          style={{ padding: 8, marginRight: 10, opacity: canGoBack ? 1 : 0.5 }}
        >
          <Text style={{ color: canGoBack ? "#007AFF" : "#999", fontSize: 16 }}>
            ←
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}
          style={{
            padding: 8,
            marginRight: 10,
            opacity: canGoForward ? 1 : 0.5,
          }}
        >
          <Text
            style={{ color: canGoForward ? "#007AFF" : "#999", fontSize: 16 }}
          >
            →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => webViewRef.current?.reload()}
          style={{ padding: 8, marginRight: 10 }}
        >
          <Text style={{ color: "#007AFF", fontSize: 16 }}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      {listingData && (
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#ddd",
          }}
        >
          <TouchableOpacity
            onPress={() => injectFormData(listingData)}
            style={{
              backgroundColor: "#007AFF",
              padding: 8,
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Fill Form</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => uploadImages(listingData.images || [])}
            style={{
              backgroundColor: "#28a745",
              padding: 8,
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Upload Images</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={submitForm}
            style={{
              backgroundColor: "#dc3545",
              padding: 8,
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getFormData}
            style={{ backgroundColor: "#6c757d", padding: 8, borderRadius: 5 }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>Get Data</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, color: "#666" }}>Loading...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: getWebViewUrl() }}
        style={{ flex: 1 }}
        injectedJavaScript={INJECTED_SCRIPT}
        onMessage={handleWebViewMessage}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Additional security settings
        allowsBackForwardNavigationGestures={true}
        allowsLinkPreview={false}
        // User agent to avoid detection
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      />
    </SafeAreaView>
  );
};

export default PlatformWebView;
