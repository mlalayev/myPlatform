"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCamera,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiShield,
  FiBell,
  FiGlobe,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import styles from "./SettingsPage.module.css";

interface UserData {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState<UserData>({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Initialize form data with current user data
    setFormData({
      name: (session.user as any).name || session.user.name?.split(" ")[0] || "",
      surname: (session.user as any).surname || session.user.name?.split(" ").slice(1).join(" ") || "",
      username: (session.user as any).username || "",
      email: session.user.email || "",
      phone: (session.user as any).phone || "",
      avatarUrl: (session.user as any).avatarUrl || "",
    });
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Here you would typically upload to your server/cloud storage
      // For now, we'll just set the preview
      setFormData(prev => ({
        ...prev,
        avatarUrl: URL.createObjectURL(file)
      }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        // Refresh session to get updated data
        window.location.reload();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating password' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Account Settings</h1>
            <p className={styles.subtitle}>
              Manage your account information and preferences
            </p>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              <span className={styles.messageIcon}>
                {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
              </span>
              {message.text}
              <button
                className={styles.messageClose}
                onClick={() => setMessage(null)}
              >
                <FiX />
              </button>
            </div>
          )}

          <div className={styles.sections}>
            {/* Profile Information Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiUser className={styles.sectionIcon} />
                <div>
                  <h2 className={styles.sectionTitle}>Profile Information</h2>
                  <p className={styles.sectionDescription}>
                    Update your personal information and profile picture
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarContainer}>
                    <img
                      src={avatarPreview || formData.avatarUrl || (session.user as any).avatarUrl || `https://ui-avatars.com/api/?name=${session.user.name}&background=6c3fc5&color=fff`}
                      alt="Profile"
                      className={styles.avatar}
                    />
                    <label className={styles.avatarUpload}>
                      <FiCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                    {isUploadingAvatar && (
                      <div className={styles.uploadOverlay}>
                        <div className={styles.spinner}></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      <FiUser className={styles.inputIcon} />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="surname" className={styles.label}>
                      <FiUser className={styles.inputIcon} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>
                      <FiUser className={styles.inputIcon} />
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your username"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      <FiMail className={styles.inputIcon} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      <FiPhone className={styles.inputIcon} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Password Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiLock className={styles.sectionIcon} />
                <div>
                  <h2 className={styles.sectionTitle}>Change Password</h2>
                  <p className={styles.sectionDescription}>
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword" className={styles.label}>
                      <FiLock className={styles.inputIcon} />
                      Current Password
                    </label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={styles.input}
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.label}>
                      <FiLock className={styles.inputIcon} />
                      New Password
                    </label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles.input}
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                      <FiLock className={styles.inputIcon} />
                      Confirm New Password
                    </label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={styles.input}
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      <>
                        <FiLock />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Account Security Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiShield className={styles.sectionIcon} />
                <div>
                  <h2 className={styles.sectionTitle}>Account Security</h2>
                  <p className={styles.sectionDescription}>
                    Manage your account security settings
                  </p>
                </div>
              </div>

              <div className={styles.securityOptions}>
                <div className={styles.securityOption}>
                  <div className={styles.securityInfo}>
                    <h3 className={styles.securityTitle}>Two-Factor Authentication</h3>
                    <p className={styles.securityDescription}>
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className={styles.securityButton}>
                    Enable 2FA
                  </button>
                </div>

                <div className={styles.securityOption}>
                  <div className={styles.securityInfo}>
                    <h3 className={styles.securityTitle}>Login Sessions</h3>
                    <p className={styles.securityDescription}>
                      Manage your active login sessions
                    </p>
                  </div>
                  <button className={styles.securityButton}>
                    View Sessions
                  </button>
                </div>
              </div>
            </section>

            {/* Notification Preferences Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <FiBell className={styles.sectionIcon} />
                <div>
                  <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                  <p className={styles.sectionDescription}>
                    Choose how you want to receive notifications
                  </p>
                </div>
              </div>

              <div className={styles.notificationOptions}>
                <div className={styles.notificationOption}>
                  <div className={styles.notificationInfo}>
                    <h3 className={styles.notificationTitle}>Email Notifications</h3>
                    <p className={styles.notificationDescription}>
                      Receive updates about your progress and new content
                    </p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationOption}>
                  <div className={styles.notificationInfo}>
                    <h3 className={styles.notificationTitle}>Push Notifications</h3>
                    <p className={styles.notificationDescription}>
                      Get instant notifications in your browser
                    </p>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 